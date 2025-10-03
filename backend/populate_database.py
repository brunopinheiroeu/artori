#!/usr/bin/env python3
"""
Comprehensive Database Population Script for Artori Admin Panel
Generates realistic test data for 4 exams with 400 questions total and 8 student accounts
"""

import os
import random
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from passlib.context import CryptContext

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

class DatabasePopulator:
    def __init__(self):
        self.mongodb_uri = os.getenv("MONGODB_URI")
        if not self.mongodb_uri:
            raise ValueError("MONGODB_URI not found in environment variables")
        
        self.client = MongoClient(self.mongodb_uri)
        self.db = self.client.artori
        
        # Test connection
        self.client.admin.command('ping')
        logger.info("✅ Connected to MongoDB successfully")
        
        # Exam and subject IDs
        self.exam_ids = {}
        self.subject_ids = {}
        
    def clear_test_data(self):
        """Clear existing test data"""
        logger.info("🧹 Clearing existing test data...")
        
        # Clear test users (keep admin users)
        test_emails = [
            "sat_student_excellent@test.com", "sat_student_average@test.com",
            "enem_student_excellent@test.com", "enem_student_average@test.com", 
            "lc_student_excellent@test.com", "lc_student_average@test.com",
            "sel_student_excellent@test.com", "sel_student_average@test.com"
        ]
        
        for email in test_emails:
            user = self.db.users.find_one({"email": email})
            if user:
                user_id = user["_id"]
                # Delete user and related data
                self.db.users.delete_one({"_id": user_id})
                self.db.user_progress.delete_many({"user_id": user_id})
                self.db.user_answers.delete_many({"user_id": user_id})
                self.db.test_sessions.delete_many({"user_id": user_id})
        
        # Clear questions and exams
        self.db.questions.delete_many({})
        self.db.exams.delete_many({})
        
        logger.info("✅ Test data cleared successfully")
    
    def create_exam_structures(self):
        """Create exam structures with subjects"""
        logger.info("📚 Creating exam structures...")
        
        # Generate IDs
        self.exam_ids = {
            "SAT": ObjectId(),
            "ENEM": ObjectId(), 
            "Leaving Certificate": ObjectId(),
            "Selectividad": ObjectId()
        }
        
        # SAT subjects
        sat_math_id = ObjectId()
        sat_reading_id = ObjectId()
        sat_writing_id = ObjectId()
        
        # ENEM subjects  
        enem_math_id = ObjectId()
        enem_portuguese_id = ObjectId()
        enem_sciences_id = ObjectId()
        enem_social_id = ObjectId()
        
        # Leaving Certificate subjects
        lc_math_id = ObjectId()
        lc_english_id = ObjectId()
        lc_sciences_id = ObjectId()
        
        # Selectividad subjects
        sel_math_id = ObjectId()
        sel_spanish_id = ObjectId()
        sel_sciences_id = ObjectId()
        sel_history_id = ObjectId()
        
        self.subject_ids = {
            "SAT": {"Math": sat_math_id, "Reading": sat_reading_id, "Writing": sat_writing_id},
            "ENEM": {"Mathematics": enem_math_id, "Portuguese": enem_portuguese_id, "Sciences": enem_sciences_id, "Social Studies": enem_social_id},
            "Leaving Certificate": {"Mathematics": lc_math_id, "English": lc_english_id, "Sciences": lc_sciences_id},
            "Selectividad": {"Mathematics": sel_math_id, "Spanish": sel_spanish_id, "Sciences": sel_sciences_id, "History": sel_history_id}
        }
        
        exams = [
            {
                "_id": self.exam_ids["SAT"],
                "name": "SAT",
                "country": "USA",
                "description": "Scholastic Assessment Test - College entrance exam used in the United States",
                "total_questions": 100,
                "gradient": "from-blue-500 to-red-500",
                "borderColor": "border-blue-500",
                "bgColor": "bg-blue-50",
                "flag": "🇺🇸",
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "subjects": [
                    {
                        "_id": sat_math_id,
                        "name": "Math",
                        "description": "Mathematics section covering algebra, geometry, and data analysis",
                        "total_questions": 33,
                        "duration": "55 min",
                        "icon": "🧮",
                        "gradient": "from-indigo-500 to-purple-500",
                        "bgColor": "bg-indigo-50"
                    },
                    {
                        "_id": sat_reading_id,
                        "name": "Reading",
                        "description": "Reading comprehension and analysis",
                        "total_questions": 34,
                        "duration": "65 min",
                        "icon": "📖",
                        "gradient": "from-blue-500 to-cyan-500",
                        "bgColor": "bg-blue-50"
                    },
                    {
                        "_id": sat_writing_id,
                        "name": "Writing",
                        "description": "Writing and language skills",
                        "total_questions": 33,
                        "duration": "35 min",
                        "icon": "✍️",
                        "gradient": "from-green-500 to-blue-500",
                        "bgColor": "bg-green-50"
                    }
                ]
            },
            {
                "_id": self.exam_ids["ENEM"],
                "name": "ENEM",
                "country": "Brazil",
                "description": "Exame Nacional do Ensino Médio - Brazilian national high school exam",
                "total_questions": 100,
                "gradient": "from-green-400 to-yellow-400",
                "borderColor": "border-green-500",
                "bgColor": "bg-green-50",
                "flag": "🇧🇷",
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "subjects": [
                    {
                        "_id": enem_math_id,
                        "name": "Mathematics",
                        "description": "Matemática e suas Tecnologias",
                        "total_questions": 25,
                        "duration": "90 min",
                        "icon": "📊",
                        "gradient": "from-indigo-500 to-purple-500",
                        "bgColor": "bg-indigo-50"
                    },
                    {
                        "_id": enem_portuguese_id,
                        "name": "Portuguese",
                        "description": "Linguagens, Códigos e suas Tecnologias",
                        "total_questions": 25,
                        "duration": "90 min",
                        "icon": "📚",
                        "gradient": "from-blue-500 to-cyan-500",
                        "bgColor": "bg-blue-50"
                    },
                    {
                        "_id": enem_sciences_id,
                        "name": "Sciences",
                        "description": "Ciências da Natureza e suas Tecnologias",
                        "total_questions": 25,
                        "duration": "90 min",
                        "icon": "🧪",
                        "gradient": "from-green-500 to-emerald-500",
                        "bgColor": "bg-green-50"
                    },
                    {
                        "_id": enem_social_id,
                        "name": "Social Studies",
                        "description": "Ciências Humanas e suas Tecnologias",
                        "total_questions": 25,
                        "duration": "90 min",
                        "icon": "🌍",
                        "gradient": "from-purple-500 to-pink-500",
                        "bgColor": "bg-purple-50"
                    }
                ]
            },
            {
                "_id": self.exam_ids["Leaving Certificate"],
                "name": "Leaving Certificate",
                "country": "Ireland",
                "description": "Irish state examination for secondary school completion",
                "total_questions": 100,
                "gradient": "from-emerald-500 to-green-500",
                "borderColor": "border-emerald-500",
                "bgColor": "bg-emerald-50",
                "flag": "🇮🇪",
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "subjects": [
                    {
                        "_id": lc_math_id,
                        "name": "Mathematics",
                        "description": "Higher Level Mathematics",
                        "total_questions": 33,
                        "duration": "150 min",
                        "icon": "🧮",
                        "gradient": "from-indigo-500 to-purple-500",
                        "bgColor": "bg-indigo-50"
                    },
                    {
                        "_id": lc_english_id,
                        "name": "English",
                        "description": "English Language and Literature",
                        "total_questions": 34,
                        "duration": "210 min",
                        "icon": "📖",
                        "gradient": "from-blue-500 to-cyan-500",
                        "bgColor": "bg-blue-50"
                    },
                    {
                        "_id": lc_sciences_id,
                        "name": "Sciences",
                        "description": "Physics, Chemistry, and Biology",
                        "total_questions": 33,
                        "duration": "180 min",
                        "icon": "🧪",
                        "gradient": "from-green-500 to-emerald-500",
                        "bgColor": "bg-green-50"
                    }
                ]
            },
            {
                "_id": self.exam_ids["Selectividad"],
                "name": "Selectividad",
                "country": "Spain",
                "description": "Spanish university entrance examination (EBAU/PAU)",
                "total_questions": 100,
                "gradient": "from-red-500 to-yellow-500",
                "borderColor": "border-red-500",
                "bgColor": "bg-red-50",
                "flag": "🇪🇸",
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "subjects": [
                    {
                        "_id": sel_math_id,
                        "name": "Mathematics",
                        "description": "Matemáticas II",
                        "total_questions": 25,
                        "duration": "90 min",
                        "icon": "🧮",
                        "gradient": "from-indigo-500 to-purple-500",
                        "bgColor": "bg-indigo-50"
                    },
                    {
                        "_id": sel_spanish_id,
                        "name": "Spanish",
                        "description": "Lengua Castellana y Literatura",
                        "total_questions": 25,
                        "duration": "90 min",
                        "icon": "📚",
                        "gradient": "from-blue-500 to-cyan-500",
                        "bgColor": "bg-blue-50"
                    },
                    {
                        "_id": sel_sciences_id,
                        "name": "Sciences",
                        "description": "Física, Química y Biología",
                        "total_questions": 25,
                        "duration": "90 min",
                        "icon": "🧪",
                        "gradient": "from-green-500 to-emerald-500",
                        "bgColor": "bg-green-50"
                    },
                    {
                        "_id": sel_history_id,
                        "name": "History",
                        "description": "Historia de España",
                        "total_questions": 25,
                        "duration": "90 min",
                        "icon": "🏛️",
                        "gradient": "from-purple-500 to-pink-500",
                        "bgColor": "bg-purple-50"
                    }
                ]
            }
        ]
        
        # Insert exams
        self.db.exams.insert_many(exams)
        logger.info(f"✅ Created {len(exams)} exam structures")
    
    def generate_questions(self):
        """Generate 400 realistic questions (100 per exam)"""
        logger.info("❓ Generating 400 realistic questions...")
        
        questions = []
        difficulties = ["easy", "medium", "hard"]
        
        # SAT Questions
        questions.extend(self._generate_sat_questions())
        
        # ENEM Questions  
        questions.extend(self._generate_enem_questions())
        
        # Leaving Certificate Questions
        questions.extend(self._generate_lc_questions())
        
        # Selectividad Questions
        questions.extend(self._generate_selectividad_questions())
        
        # Insert all questions
        self.db.questions.insert_many(questions)
        logger.info(f"✅ Generated and inserted {len(questions)} questions")
        
        return questions
    
    def _generate_sat_questions(self) -> List[Dict]:
        """Generate SAT questions"""
        questions = []
        
        # SAT Math Questions (33)
        sat_math_questions = [
            {
                "question": "If 3x + 7 = 22, what is the value of x?",
                "options": [
                    {"id": "a", "text": "3"},
                    {"id": "b", "text": "5"},
                    {"id": "c", "text": "7"},
                    {"id": "d", "text": "15"}
                ],
                "correct_answer": "b",
                "difficulty": "easy",
                "tags": ["algebra", "linear equations"]
            },
            {
                "question": "A circle has a radius of 6 units. What is its area?",
                "options": [
                    {"id": "a", "text": "12π"},
                    {"id": "b", "text": "36π"},
                    {"id": "c", "text": "72π"},
                    {"id": "d", "text": "144π"}
                ],
                "correct_answer": "b",
                "difficulty": "medium",
                "tags": ["geometry", "circles"]
            },
            {
                "question": "If f(x) = 2x² - 3x + 1, what is f(2)?",
                "options": [
                    {"id": "a", "text": "3"},
                    {"id": "b", "text": "5"},
                    {"id": "c", "text": "7"},
                    {"id": "d", "text": "11"}
                ],
                "correct_answer": "a",
                "difficulty": "medium",
                "tags": ["functions", "polynomials"]
            },
            {
                "question": "What is the slope of the line passing through points (2, 3) and (6, 11)?",
                "options": [
                    {"id": "a", "text": "1"},
                    {"id": "b", "text": "2"},
                    {"id": "c", "text": "3"},
                    {"id": "d", "text": "4"}
                ],
                "correct_answer": "b",
                "difficulty": "easy",
                "tags": ["coordinate geometry", "slope"]
            },
            {
                "question": "If 2^x = 32, what is the value of x?",
                "options": [
                    {"id": "a", "text": "4"},
                    {"id": "b", "text": "5"},
                    {"id": "c", "text": "6"},
                    {"id": "d", "text": "16"}
                ],
                "correct_answer": "b",
                "difficulty": "medium",
                "tags": ["exponentials", "logarithms"]
            }
        ]
        
        # Generate more math questions to reach 33
        for i in range(len(sat_math_questions), 33):
            difficulty = random.choice(["easy", "medium", "hard"])
            sat_math_questions.append({
                "question": f"SAT Math Question {i+1}: If x + {i+2} = {i+10}, what is x?",
                "options": [
                    {"id": "a", "text": f"{i+5}"},
                    {"id": "b", "text": f"{i+8}"},
                    {"id": "c", "text": f"{i+8}"},
                    {"id": "d", "text": f"{i+12}"}
                ],
                "correct_answer": "b",
                "difficulty": difficulty,
                "tags": ["algebra", "problem solving"]
            })
        
        # Convert to full question format
        for q in sat_math_questions:
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["SAT"]["Math"],
                "question": q["question"],
                "options": q["options"],
                "correct_answer": q["correct_answer"],
                "difficulty": q["difficulty"],
                "question_type": "multiple_choice",
                "status": "active",
                "tags": q["tags"],
                "duration": 90,
                "explanation": {
                    "reasoning": ["Step-by-step solution provided", "Mathematical principles applied", "Answer verified"],
                    "concept": "Mathematical problem solving",
                    "sources": ["SAT Official Study Guide", "College Board Materials"],
                    "bias_check": "Mathematical content is objective and unbiased",
                    "reflection": "This question tests fundamental mathematical concepts"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # SAT Reading Questions (34)
        sat_reading_base = [
            {
                "question": "Based on the passage, the author's primary purpose is to:",
                "options": [
                    {"id": "a", "text": "Argue for a specific policy change"},
                    {"id": "b", "text": "Explain a complex scientific phenomenon"},
                    {"id": "c", "text": "Compare different historical periods"},
                    {"id": "d", "text": "Analyze the causes of a social issue"}
                ],
                "correct_answer": "d",
                "difficulty": "medium",
                "tags": ["reading comprehension", "author's purpose"]
            },
            {
                "question": "The word 'profound' in line 23 most nearly means:",
                "options": [
                    {"id": "a", "text": "Deep"},
                    {"id": "b", "text": "Obvious"},
                    {"id": "c", "text": "Temporary"},
                    {"id": "d", "text": "Surprising"}
                ],
                "correct_answer": "a",
                "difficulty": "easy",
                "tags": ["vocabulary", "context clues"]
            }
        ]
        
        # Generate more reading questions to reach 34
        for i in range(len(sat_reading_base), 34):
            difficulty = random.choice(["easy", "medium", "hard"])
            sat_reading_base.append({
                "question": f"Reading Question {i+1}: What is the main idea of paragraph {i%5+1}?",
                "options": [
                    {"id": "a", "text": f"Option A for question {i+1}"},
                    {"id": "b", "text": f"Option B for question {i+1}"},
                    {"id": "c", "text": f"Option C for question {i+1}"},
                    {"id": "d", "text": f"Option D for question {i+1}"}
                ],
                "correct_answer": random.choice(["a", "b", "c", "d"]),
                "difficulty": difficulty,
                "tags": ["reading comprehension", "main idea"]
            })
        
        for q in sat_reading_base:
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["SAT"]["Reading"],
                "question": q["question"],
                "options": q["options"],
                "correct_answer": q["correct_answer"],
                "difficulty": q["difficulty"],
                "question_type": "multiple_choice",
                "status": "active",
                "tags": q["tags"],
                "duration": 75,
                "explanation": {
                    "reasoning": ["Textual evidence supports this answer", "Context provides clear indication", "Other options are eliminated"],
                    "concept": "Reading comprehension and analysis",
                    "sources": ["SAT Reading Practice Tests", "College Board Materials"],
                    "bias_check": "Analysis based on textual evidence",
                    "reflection": "This question tests critical reading skills"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # SAT Writing Questions (33)
        for i in range(33):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["SAT"]["Writing"],
                "question": f"Writing Question {i+1}: Which choice best maintains the sentence's focus on the main topic?",
                "options": [
                    {"id": "a", "text": f"Writing option A {i+1}"},
                    {"id": "b", "text": f"Writing option B {i+1}"},
                    {"id": "c", "text": f"Writing option C {i+1}"},
                    {"id": "d", "text": f"Writing option D {i+1}"}
                ],
                "correct_answer": random.choice(["a", "b", "c", "d"]),
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["grammar", "writing", "sentence structure"],
                "duration": 60,
                "explanation": {
                    "reasoning": ["Grammar rules support this choice", "Maintains clarity and focus", "Follows standard conventions"],
                    "concept": "Writing and language skills",
                    "sources": ["SAT Writing Practice Tests", "Grammar Guidelines"],
                    "bias_check": "Based on standard grammar and writing conventions",
                    "reflection": "This question tests writing and language proficiency"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        return questions
    
    def _generate_enem_questions(self) -> List[Dict]:
        """Generate ENEM questions"""
        questions = []
        
        # ENEM Mathematics (25)
        for i in range(25):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["ENEM"]["Mathematics"],
                "question": f"ENEM Matemática {i+1}: Uma função f(x) = 2x + {i+3}. Qual é o valor de f({i+2})?",
                "options": [
                    {"id": "a", "text": f"{2*(i+2) + (i+3)}"},
                    {"id": "b", "text": f"{2*(i+2) + (i+3) + 1}"},
                    {"id": "c", "text": f"{2*(i+2) + (i+3) - 1}"},
                    {"id": "d", "text": f"{2*(i+2) + (i+3) + 2}"}
                ],
                "correct_answer": "a",
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["matemática", "funções", "álgebra"],
                "duration": 180,
                "explanation": {
                    "reasoning": ["Substituir x na função", "Calcular o resultado", "Verificar a resposta"],
                    "concept": "Funções matemáticas",
                    "sources": ["ENEM Matemática", "Livros didáticos"],
                    "bias_check": "Conteúdo matemático objetivo",
                    "reflection": "Esta questão testa conhecimentos básicos de funções"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # ENEM Portuguese (25)
        for i in range(25):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["ENEM"]["Portuguese"],
                "question": f"ENEM Português {i+1}: Analise o texto e identifique a função da linguagem predominante.",
                "options": [
                    {"id": "a", "text": "Função referencial"},
                    {"id": "b", "text": "Função emotiva"},
                    {"id": "c", "text": "Função conativa"},
                    {"id": "d", "text": "Função metalinguística"}
                ],
                "correct_answer": random.choice(["a", "b", "c", "d"]),
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["português", "linguagem", "interpretação"],
                "duration": 180,
                "explanation": {
                    "reasoning": ["Analisar o contexto do texto", "Identificar o foco comunicativo", "Aplicar teoria das funções"],
                    "concept": "Funções da linguagem",
                    "sources": ["ENEM Linguagens", "Gramática portuguesa"],
                    "bias_check": "Baseado na teoria linguística estabelecida",
                    "reflection": "Esta questão avalia compreensão das funções da linguagem"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # ENEM Sciences (25)
        for i in range(25):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["ENEM"]["Sciences"],
                "question": f"ENEM Ciências {i+1}: Qual é a fórmula química da água?",
                "options": [
                    {"id": "a", "text": "H2O"},
                    {"id": "b", "text": "CO2"},
                    {"id": "c", "text": "NaCl"},
                    {"id": "d", "text": "CH4"}
                ],
                "correct_answer": "a",
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["ciências", "química", "fórmulas"],
                "duration": 180,
                "explanation": {
                    "reasoning": ["A água é composta por hidrogênio e oxigênio", "Dois átomos de H e um de O", "Fórmula molecular básica"],
                    "concept": "Química básica",
                    "sources": ["ENEM Ciências da Natureza", "Livros de química"],
                    "bias_check": "Conhecimento científico estabelecido",
                    "reflection": "Esta questão testa conhecimentos fundamentais de química"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # ENEM Social Studies (25)
        for i in range(25):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["ENEM"]["Social Studies"],
                "question": f"ENEM Humanas {i+1}: Sobre a formação do território brasileiro, é correto afirmar:",
                "options": [
                    {"id": "a", "text": "Foi influenciada apenas por fatores geográficos"},
                    {"id": "b", "text": "Resultou de processos históricos complexos"},
                    {"id": "c", "text": "Ocorreu de forma homogênea em todo território"},
                    {"id": "d", "text": "Não sofreu influências externas"}
                ],
                "correct_answer": "b",
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["história", "geografia", "brasil"],
                "duration": 180,
                "explanation": {
                    "reasoning": ["Formação territorial é processo complexo", "Envolve fatores históricos, sociais e econômicos", "Não pode ser explicada por um único fator"],
                    "concept": "Formação territorial brasileira",
                    "sources": ["ENEM Ciências Humanas", "História do Brasil"],
                    "bias_check": "Baseado em conhecimento histórico estabelecido",
                    "reflection": "Esta questão avalia compreensão de processos históricos"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        return questions
    
    def _generate_lc_questions(self) -> List[Dict]:
        """Generate Leaving Certificate questions"""
        questions = []
        
        # LC Mathematics (33)
        for i in range(33):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["Leaving Certificate"]["Mathematics"],
                "question": f"LC Maths {i+1}: Find the derivative of f(x) = x² + {i+3}x + {i+1}",
                "options": [
                    {"id": "a", "text": f"2x + {i+3}"},
                    {"id": "b", "text": f"x² + {i+3}"},
                    {"id": "c", "text": f"2x + {i+1}"},
                    {"id": "d", "text": f"x + {i+3}"}
                ],
                "correct_answer": "a",
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["calculus", "derivatives", "mathematics"],
                "duration": 270,
                "explanation": {
                    "reasoning": ["Apply power rule for derivatives", "d/dx(x²) = 2x", "d/dx(constant) = 0"],
                    "concept": "Calculus - Derivatives",
                    "sources": ["LC Mathematics Syllabus", "Calculus Textbooks"],
                    "bias_check": "Mathematical content is objective",
                    "reflection": "This question tests basic differentiation skills"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # LC English (34)
        for i in range(34):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["Leaving Certificate"]["English"],
                "question": f"LC English {i+1}: In the context of Irish literature, which theme is most prominent?",
                "options": [
                    {"id": "a", "text": "Identity and belonging"},
                    {"id": "b", "text": "Technology and progress"},
                    {"id": "c", "text": "Space exploration"},
                    {"id": "d", "text": "Ancient mythology"}
                ],
                "correct_answer": "a",
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["literature", "irish culture", "themes"],
                "duration": 300,
                "explanation": {
                    "reasoning": ["Irish literature often explores identity", "Historical context supports this theme", "Many Irish authors address belonging"],
                    "concept": "Irish Literature Themes",
                    "sources": ["LC English Syllabus", "Irish Literary Canon"],
                    "bias_check": "Based on established literary analysis",
                    "reflection": "This question tests understanding of Irish literary themes"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # LC Sciences (33)
        for i in range(33):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["Leaving Certificate"]["Sciences"],
                "question": f"LC Science {i+1}: What is the chemical formula for sodium chloride?",
                "options": [
                    {"id": "a", "text": "NaCl"},
                    {"id": "b", "text": "Na2Cl"},
                    {"id": "c", "text": "NaCl2"},
                    {"id": "d", "text": "Na2Cl2"}
                ],
                "correct_answer": "a",
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["chemistry", "compounds", "formulas"],
                "duration": 240,
                "explanation": {
                    "reasoning": ["Sodium has +1 charge", "Chloride has -1 charge", "1:1 ratio forms NaCl"],
                    "concept": "Chemical Formulas",
                    "sources": ["LC Chemistry Syllabus", "Chemistry Textbooks"],
                    "bias_check": "Scientific facts are objective",
                    "reflection": "This question tests basic chemistry knowledge"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        return questions
    
    def _generate_selectividad_questions(self) -> List[Dict]:
        """Generate Selectividad questions"""
        questions = []
        
        # Selectividad Mathematics (25)
        for i in range(25):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["Selectividad"]["Mathematics"],
                "question": f"Selectividad Matemáticas {i+1}: Calcula la integral de f(x) = 2x + {i+1}",
                "options": [
                    {"id": "a", "text": f"x² + {i+1}x + C"},
                    {"id": "b", "text": f"2x² + {i+1}x + C"},
                    {"id": "c", "text": f"x² + {i+1} + C"},
                    {"id": "d", "text": f"2x + C"}
                ],
                "correct_answer": "a",
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["cálculo", "integrales", "matemáticas"],
                "duration": 180,
                "explanation": {
                    "reasoning": ["Aplicar regla de integración", "∫2x dx = x²", "∫constante dx = constante·x"],
                    "concept": "Cálculo integral",
                    "sources": ["Selectividad Matemáticas", "Libros de cálculo"],
                    "bias_check": "Contenido matemático objetivo",
                    "reflection": "Esta pregunta evalúa conocimientos de integración"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # Selectividad Spanish (25)
        for i in range(25):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["Selectividad"]["Spanish"],
                "question": f"Selectividad Español {i+1}: ¿Cuál es la función sintáctica de 'muy rápidamente'?",
                "options": [
                    {"id": "a", "text": "Complemento circunstancial de modo"},
                    {"id": "b", "text": "Complemento directo"},
                    {"id": "c", "text": "Atributo"},
                    {"id": "d", "text": "Complemento indirecto"}
                ],
                "correct_answer": "a",
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["sintaxis", "gramática", "español"],
                "duration": 180,
                "explanation": {
                    "reasoning": ["'Muy rápidamente' indica modo", "Es un adverbio de modo", "Funciona como complemento circunstancial"],
                    "concept": "Análisis sintáctico",
                    "sources": ["Selectividad Lengua", "Gramática española"],
                    "bias_check": "Basado en reglas gramaticales establecidas",
                    "reflection": "Esta pregunta evalúa conocimientos de sintaxis"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # Selectividad Sciences (25)
        for i in range(25):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["Selectividad"]["Sciences"],
                "question": f"Selectividad Ciencias {i+1}: ¿Cuál es la velocidad de la luz en el vacío?",
                "options": [
                    {"id": "a", "text": "3 × 10⁸ m/s"},
                    {"id": "b", "text": "3 × 10⁶ m/s"},
                    {"id": "c", "text": "3 × 10¹⁰ m/s"},
                    {"id": "d", "text": "3 × 10⁴ m/s"}
                ],
                "correct_answer": "a",
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["física", "constantes", "luz"],
                "duration": 180,
                "explanation": {
                    "reasoning": ["Constante física fundamental", "Valor establecido experimentalmente", "Base de la relatividad"],
                    "concept": "Constantes físicas",
                    "sources": ["Selectividad Física", "Libros de física"],
                    "bias_check": "Conocimiento científico establecido",
                    "reflection": "Esta pregunta evalúa conocimientos de física básica"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        # Selectividad History (25)
        for i in range(25):
            difficulty = random.choice(["easy", "medium", "hard"])
            questions.append({
                "_id": ObjectId(),
                "subject_id": self.subject_ids["Selectividad"]["History"],
                "question": f"Selectividad Historia {i+1}: ¿En qué año comenzó la Guerra Civil Española?",
                "options": [
                    {"id": "a", "text": "1936"},
                    {"id": "b", "text": "1934"},
                    {"id": "c", "text": "1938"},
                    {"id": "d", "text": "1939"}
                ],
                "correct_answer": "a",
                "difficulty": difficulty,
                "question_type": "multiple_choice",
                "status": "active",
                "tags": ["historia", "españa", "guerra civil"],
                "duration": 180,
                "explanation": {
                    "reasoning": ["Alzamiento militar en julio de 1936", "Fecha histórica establecida", "Inicio del conflicto"],
                    "concept": "Historia de España",
                    "sources": ["Selectividad Historia", "Libros de historia"],
                    "bias_check": "Basado en hechos históricos documentados",
                    "reflection": "Esta pregunta evalúa conocimientos de historia española"
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            })
        
        return questions
    
    def create_student_accounts(self):
        """Create 8 student test accounts (2 per exam)"""
        logger.info("👥 Creating 8 student test accounts...")
        
        students = [
            # SAT Students
            {
                "name": "Sarah Johnson",
                "email": "sat_student_excellent@test.com",
                "password": "TestPass123!",
                "exam": "SAT",
                "performance_level": "excellent",
                "accuracy_rate": 0.92
            },
            {
                "name": "Mike Chen",
                "email": "sat_student_average@test.com",
                "password": "TestPass123!",
                "exam": "SAT",
                "performance_level": "average",
                "accuracy_rate": 0.70
            },
            # ENEM Students
            {
                "name": "Ana Silva",
                "email": "enem_student_excellent@test.com",
                "password": "TestPass123!",
                "exam": "ENEM",
                "performance_level": "excellent",
                "accuracy_rate": 0.91
            },
            {
                "name": "Carlos Santos",
                "email": "enem_student_average@test.com",
                "password": "TestPass123!",
                "exam": "ENEM",
                "performance_level": "average",
                "accuracy_rate": 0.69
            },
            # Leaving Certificate Students
            {
                "name": "Emma O'Connor",
                "email": "lc_student_excellent@test.com",
                "password": "TestPass123!",
                "exam": "Leaving Certificate",
                "performance_level": "excellent",
                "accuracy_rate": 0.93
            },
            {
                "name": "Liam Murphy",
                "email": "lc_student_average@test.com",
                "password": "TestPass123!",
                "exam": "Leaving Certificate",
                "performance_level": "average",
                "accuracy_rate": 0.71
            },
            # Selectividad Students
            {
                "name": "María García",
                "email": "sel_student_excellent@test.com",
                "password": "TestPass123!",
                "exam": "Selectividad",
                "performance_level": "excellent",
                "accuracy_rate": 0.90
            },
            {
                "name": "Pablo Rodríguez",
                "email": "sel_student_average@test.com",
                "password": "TestPass123!",
                "exam": "Selectividad",
                "performance_level": "average",
                "accuracy_rate": 0.68
            }
        ]
        
        created_students = []
        for student in students:
            # Hash password
            hashed_password = get_password_hash(student["password"])
            
            # Create user document
            user_doc = {
                "name": student["name"],
                "email": student["email"],
                "password": hashed_password,
                "role": "student",
                "status": "active",
                "selected_exam_id": self.exam_ids[student["exam"]],
                "created_at": datetime.utcnow() - timedelta(days=random.randint(30, 90)),
                "updated_at": datetime.utcnow(),
                "login_count": random.randint(15, 50),
                "last_login": datetime.utcnow() - timedelta(days=random.randint(1, 7))
            }
            
            # Insert user
            result = self.db.users.insert_one(user_doc)
            student["user_id"] = result.inserted_id
            created_students.append(student)
        
        logger.info(f"✅ Created {len(created_students)} student accounts")
        return created_students
    
    def generate_user_progress_data(self, students: List[Dict], questions: List[Dict]):
        """Generate realistic user progress and answer data"""
        logger.info("📊 Generating realistic user progress and answer data...")
        
        user_answers = []
        user_progress = []
        
        for student in students:
            exam_name = student["exam"]
            user_id = student["user_id"]
            accuracy_rate = student["accuracy_rate"]
            
            # Get questions for this exam
            exam_questions = [q for q in questions if any(
                str(q["subject_id"]) == str(subject_id)
                for subject_id in self.subject_ids[exam_name].values()
            )]
            
            # Answer 50-80% of questions
            num_questions_to_answer = int(len(exam_questions) * random.uniform(0.5, 0.8))
            questions_to_answer = random.sample(exam_questions, num_questions_to_answer)
            
            # Generate answers over several weeks
            start_date = datetime.utcnow() - timedelta(days=45)
            
            subject_stats = {}
            for subject_name, subject_id in self.subject_ids[exam_name].items():
                subject_stats[str(subject_id)] = {
                    "questions_solved": 0,
                    "correct_answers": 0,
                    "subject_name": subject_name
                }
            
            for i, question in enumerate(questions_to_answer):
                # Determine if answer is correct based on student's accuracy rate
                is_correct = random.random() < accuracy_rate
                
                # Select answer
                if is_correct:
                    selected_answer = question["correct_answer"]
                else:
                    # Select wrong answer
                    options = ["a", "b", "c", "d"]
                    options.remove(question["correct_answer"])
                    selected_answer = random.choice(options)
                
                # Generate realistic timestamp (spread over weeks)
                days_offset = int((i / len(questions_to_answer)) * 45)
                hours_offset = random.randint(0, 23)
                minutes_offset = random.randint(0, 59)
                
                answered_at = start_date + timedelta(
                    days=days_offset,
                    hours=hours_offset,
                    minutes=minutes_offset
                )
                
                # Create user answer
                user_answers.append({
                    "user_id": user_id,
                    "question_id": question["_id"],
                    "selected_option_id": selected_answer,
                    "is_correct": is_correct,
                    "answered_at": answered_at
                })
                
                # Update subject stats
                subject_id_str = str(question["subject_id"])
                if subject_id_str in subject_stats:
                    subject_stats[subject_id_str]["questions_solved"] += 1
                    if is_correct:
                        subject_stats[subject_id_str]["correct_answers"] += 1
            
            # Create progress records for each subject
            for subject_id_str, stats in subject_stats.items():
                if stats["questions_solved"] > 0:
                    accuracy = (stats["correct_answers"] / stats["questions_solved"]) * 100
                    
                    user_progress.append({
                        "user_id": user_id,
                        "exam_id": self.exam_ids[exam_name],
                        "subject_id": ObjectId(subject_id_str),
                        "questions_solved": stats["questions_solved"],
                        "correct_answers": stats["correct_answers"],
                        "accuracy_rate": accuracy,
                        "last_studied_date": datetime.utcnow() - timedelta(days=random.randint(1, 7))
                    })
        
        # Insert user answers and progress
        if user_answers:
            self.db.user_answers.insert_many(user_answers)
            logger.info(f"✅ Generated {len(user_answers)} user answers")
        
        if user_progress:
            self.db.user_progress.insert_many(user_progress)
            logger.info(f"✅ Generated {len(user_progress)} progress records")
    
    def create_analytics_data(self):
        """Create supporting analytics data"""
        logger.info("📈 Creating supporting analytics data...")
        
        # Create analytics metrics
        analytics_metrics = []
        time_series_data = []
        
        # Generate data for the last 30 days
        for i in range(30):
            date = datetime.utcnow() - timedelta(days=i)
            
            # System performance metrics
            analytics_metrics.append({
                "metric_type": "system_performance",
                "date": date,
                "value": random.uniform(40, 60),  # Response time
                "metadata": {
                    "response_time": random.uniform(40, 60),
                    "throughput": random.uniform(1000, 1500),
                    "error_rate": random.uniform(0.05, 0.2)
                },
                "created_at": date
            })
            
            # User engagement metrics
            analytics_metrics.append({
                "metric_type": "user_engagement",
                "date": date,
                "value": random.uniform(80, 95),
                "metadata": {
                    "active_users": random.randint(100, 200),
                    "session_duration": random.uniform(20, 35)
                },
                "created_at": date
            })
            
            # Time series data
            time_series_data.extend([
                {
                    "metric_name": "user_engagement",
                    "timestamp": date,
                    "value": random.uniform(80, 95),
                    "tags": {"type": "daily"},
                    "created_at": date
                },
                {
                    "metric_name": "system_performance",
                    "timestamp": date,
                    "value": random.uniform(40, 60),
                    "tags": {"type": "daily"},
                    "created_at": date
                }
            ])
        
        # Insert analytics data
        if analytics_metrics:
            self.db.analytics_metrics.insert_many(analytics_metrics)
            logger.info(f"✅ Created {len(analytics_metrics)} analytics metrics")
        
        if time_series_data:
            self.db.time_series_data.insert_many(time_series_data)
            logger.info(f"✅ Created {len(time_series_data)} time series data points")
    
    def run_population(self):
        """Run the complete database population process"""
        logger.info("🚀 Starting comprehensive database population...")
        
        try:
            # Step 1: Clear existing test data
            self.clear_test_data()
            
            # Step 2: Create exam structures
            self.create_exam_structures()
            
            # Step 3: Generate questions
            questions = self.generate_questions()
            
            # Step 4: Create student accounts
            students = self.create_student_accounts()
            
            # Step 5: Generate user progress data
            self.generate_user_progress_data(students, questions)
            
            # Step 6: Create analytics data
            self.create_analytics_data()
            
            # Summary
            self.print_summary()
            
            logger.info("🎉 Database population completed successfully!")
            
        except Exception as e:
            logger.error(f"❌ Database population failed: {e}")
            raise
        finally:
            self.client.close()
    
    def print_summary(self):
        """Print summary of created data"""
        logger.info("\n" + "="*50)
        logger.info("📋 DATABASE POPULATION SUMMARY")
        logger.info("="*50)
        
        # Count documents
        exams_count = self.db.exams.count_documents({})
        questions_count = self.db.questions.count_documents({})
        users_count = self.db.users.count_documents({"role": "student"})
        answers_count = self.db.user_answers.count_documents({})
        progress_count = self.db.user_progress.count_documents({})
        analytics_count = self.db.analytics_metrics.count_documents({})
        
        logger.info(f"📚 Exams created: {exams_count}")
        logger.info(f"❓ Questions created: {questions_count}")
        logger.info(f"👥 Student accounts: {users_count}")
        logger.info(f"✅ User answers: {answers_count}")
        logger.info(f"📊 Progress records: {progress_count}")
        logger.info(f"📈 Analytics metrics: {analytics_count}")
        
        # Questions per exam
        logger.info("\n📊 Questions per exam:")
        for exam_name, exam_id in self.exam_ids.items():
            exam_questions = 0
            for subject_id in self.subject_ids[exam_name].values():
                count = self.db.questions.count_documents({"subject_id": subject_id})
                exam_questions += count
            logger.info(f"  {exam_name}: {exam_questions} questions")
        
        # Student accounts per exam
        logger.info("\n👥 Student accounts per exam:")
        for exam_name, exam_id in self.exam_ids.items():
            count = self.db.users.count_documents({
                "selected_exam_id": exam_id,
                "role": "student"
            })
            logger.info(f"  {exam_name}: {count} students")
        
        logger.info("="*50)


def main():
    """Main function to run database population"""
    try:
        populator = DatabasePopulator()
        populator.run_population()
    except Exception as e:
        logger.error(f"Failed to populate database: {e}")
        return 1
    return 0


if __name__ == "__main__":
    exit(main())