import os
import logging
from typing import Dict, List, Optional
from openai import OpenAI
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

class AIService:
    """AI service for generating explanations and educational content"""
    
    def __init__(self):
        self.client = None
        self.api_key = os.getenv("OPENAI_API_KEY")
        
        if self.api_key:
            try:
                self.client = OpenAI(api_key=self.api_key)
                logger.info("✅ OpenAI client initialized successfully")
            except Exception as e:
                logger.error(f"❌ Failed to initialize OpenAI client: {e}")
                self.client = None
        else:
            logger.warning("⚠️ OPENAI_API_KEY not found in environment variables")
    
    def is_available(self) -> bool:
        """Check if AI service is available"""
        return self.client is not None
    
    async def generate_explanation(
        self,
        question: str,
        options: List[Dict[str, str]],
        correct_answer: str,
        selected_answer: Optional[str] = None,
        subject: str = "General",
        difficulty: str = "medium"
    ) -> Dict[str, any]:
        """
        Generate an AI explanation for a question
        
        Args:
            question: The question text
            options: List of answer options with id and text
            correct_answer: The correct answer option id
            subject: Subject area (e.g., "Mathematics", "Science")
            difficulty: Question difficulty level
            
        Returns:
            Dictionary with explanation components
        """
        if not self.is_available():
            return self._get_fallback_explanation()
        
        try:
            # Find the correct answer text
            correct_answer_text = next(
                (opt["text"] for opt in options if opt["id"] == correct_answer),
                "Unknown"
            )
            
            # Find the selected answer text if provided
            selected_answer_text = None
            if selected_answer:
                selected_answer_text = next(
                    (opt["text"] for opt in options if opt["id"] == selected_answer),
                    "Unknown"
                )
            
            # Format options for the prompt
            options_text = "\n".join([f"{opt['id']}: {opt['text']}" for opt in options])
            
            # Create contextual prompt based on whether user's answer was provided
            if selected_answer and selected_answer_text:
                user_context = f"""
Student's Answer: {selected_answer} - {selected_answer_text}
Student was {'CORRECT' if selected_answer == correct_answer else 'INCORRECT'}
"""
                explanation_focus = "Focus on explaining why the student's answer was correct/incorrect and provide guidance for improvement." if selected_answer != correct_answer else "Reinforce why the student's answer was correct and expand on the concept."
            else:
                user_context = ""
                explanation_focus = "Provide a general explanation of the concept and correct answer."
            
            # Create the prompt
            prompt = f"""
You are an expert educational AI tutor. Generate a comprehensive, personalized explanation for this {subject} question.

Question: {question}

Options:
{options_text}

Correct Answer: {correct_answer} - {correct_answer_text}
{user_context}

{explanation_focus}

Please provide a detailed explanation in the following JSON format:
{{
    "reasoning": [
        "Step-by-step reasoning point 1",
        "Step-by-step reasoning point 2",
        "Step-by-step reasoning point 3"
    ],
    "concept": "Main concept or principle being tested",
    "sources": [
        "Relevant textbook or reference 1",
        "Relevant textbook or reference 2"
    ],
    "bias_check": "Brief note about potential biases or common misconceptions",
    "reflection": "Summary and key takeaway for the student"
}}

Make sure the explanation is:
- Clear and educational
- Appropriate for the {difficulty} difficulty level
- Focused on helping students understand the concept
- Free from bias and misconceptions
- Encouraging and supportive in tone
"""

            # Make API call
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert educational AI tutor. Always respond with valid JSON format."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            # Parse the response
            explanation_text = response.choices[0].message.content.strip()
            
            # Try to parse as JSON
            try:
                explanation_data = json.loads(explanation_text)
                
                # Validate required fields
                required_fields = ["reasoning", "concept", "sources", "bias_check", "reflection"]
                for field in required_fields:
                    if field not in explanation_data:
                        logger.warning(f"Missing field {field} in AI response, using fallback")
                        return self._get_fallback_explanation()
                
                # Ensure reasoning is a list
                if not isinstance(explanation_data["reasoning"], list):
                    explanation_data["reasoning"] = [str(explanation_data["reasoning"])]
                
                # Ensure sources is a list
                if not isinstance(explanation_data["sources"], list):
                    explanation_data["sources"] = [str(explanation_data["sources"])]
                
                logger.info("✅ AI explanation generated successfully")
                return explanation_data
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response as JSON: {e}")
                logger.error(f"Raw response: {explanation_text}")
                return self._get_fallback_explanation()
                
        except Exception as e:
            logger.error(f"Failed to generate AI explanation: {e}")
            return self._get_fallback_explanation()
    
    def _get_fallback_explanation(self) -> Dict[str, any]:
        """Get a fallback explanation when AI service is unavailable"""
        return {
            "reasoning": [
                "This question tests your understanding of the key concepts in this subject area.",
                "Review the question carefully and consider each option systematically.",
                "The correct answer demonstrates the proper application of the relevant principles."
            ],
            "concept": "Core subject knowledge and application",
            "sources": [
                "Standard textbook for this subject",
                "Course materials and lecture notes"
            ],
            "bias_check": "No significant biases detected in this question.",
            "reflection": "Understanding this concept will help you tackle similar problems in the future. Keep practicing!"
        }
    
    async def generate_chat_response(
        self,
        messages: List[Dict[str, str]],
        question_context: Optional[Dict[str, any]] = None
    ) -> str:
        """
        Generate a conversational AI response based on chat history
        
        Args:
            messages: List of conversation messages with role and content
            question_context: Optional context about the original question
            
        Returns:
            AI response string
        """
        if not self.is_available():
            return self._get_fallback_chat_response()
        
        try:
            # Build the system prompt for conversational tutoring
            system_prompt = """You are an expert AI tutor helping students understand educational concepts. You maintain context throughout the conversation and provide helpful, educational responses.

Guidelines:
- Maintain conversation context and remember what was discussed
- Provide helpful, educational responses to student questions
- When asked for resources (like YouTube videos, books, websites), provide specific, relevant suggestions
- Explain concepts clearly and encourage learning
- Be supportive and encouraging
- If asked about topics outside the original question, still try to be helpful while staying educational
- Keep responses concise but informative"""

            # Add question context if provided
            if question_context:
                context_info = f"""
                
Original Question Context:
- Question: {question_context.get('question', 'N/A')}
- Student's Answer: {question_context.get('selected_answer_text', 'N/A')}
- Correct Answer: {question_context.get('correct_answer_text', 'N/A')}
- Was Correct: {question_context.get('is_correct', False)}"""
                system_prompt += context_info

            # Prepare messages for API call
            api_messages = [{"role": "system", "content": system_prompt}]
            
            # Add conversation history, limiting to last 10 messages to manage token usage
            recent_messages = messages[-10:] if len(messages) > 10 else messages
            api_messages.extend(recent_messages)

            # Make API call
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=api_messages,
                max_tokens=500,
                temperature=0.7
            )
            
            response_text = response.choices[0].message.content.strip()
            logger.info("✅ AI chat response generated successfully")
            return response_text
            
        except Exception as e:
            logger.error(f"Failed to generate AI chat response: {e}")
            return self._get_fallback_chat_response()
    
    def _get_fallback_chat_response(self) -> str:
        """Get a fallback chat response when AI service is unavailable"""
        return "I'm sorry, I'm having trouble responding right now. Please try asking your question again, or refer to your course materials for additional help."
    
    async def generate_study_tips(
        self, 
        subject: str, 
        user_performance: Dict[str, any]
    ) -> List[str]:
        """
        Generate personalized study tips based on user performance
        
        Args:
            subject: Subject area
            user_performance: Dictionary with accuracy, weak_areas, etc.
            
        Returns:
            List of study tips
        """
        if not self.is_available():
            return self._get_fallback_study_tips(subject)
        
        try:
            accuracy = user_performance.get("accuracy_rate", 0)
            weak_areas = user_performance.get("weak_areas", [])
            
            prompt = f"""
Generate 3-5 personalized study tips for a student studying {subject}.

Student Performance:
- Current accuracy: {accuracy}%
- Weak areas: {', '.join(weak_areas) if weak_areas else 'None identified'}

Provide practical, actionable study tips in JSON format:
{{
    "tips": [
        "Specific tip 1",
        "Specific tip 2",
        "Specific tip 3"
    ]
}}
"""

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful study advisor. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=400,
                temperature=0.8
            )
            
            tips_text = response.choices[0].message.content.strip()
            tips_data = json.loads(tips_text)
            
            return tips_data.get("tips", self._get_fallback_study_tips(subject))
            
        except Exception as e:
            logger.error(f"Failed to generate study tips: {e}")
            return self._get_fallback_study_tips(subject)
    
    def _get_fallback_study_tips(self, subject: str) -> List[str]:
        """Get fallback study tips when AI service is unavailable"""
        return [
            f"Review the fundamental concepts in {subject} regularly",
            "Practice with a variety of question types to build confidence",
            "Create summary notes for key topics and formulas",
            "Take practice tests to identify areas for improvement",
            "Join study groups or seek help from tutors when needed"
        ]

# Global AI service instance
ai_service = AIService()