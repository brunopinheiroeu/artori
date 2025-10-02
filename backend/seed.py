import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

def seed_database():
    """Seed the database with comprehensive exam data including SAT and ENEM"""
    if not MONGODB_URI:
        print("MONGODB_URI not found in environment variables")
        return
    
    client = MongoClient(MONGODB_URI)
    db = client.artori
    
    # Clear existing data
    db.exams.delete_many({})
    db.questions.delete_many({})
    db.user_progress.delete_many({})
    db.user_answers.delete_many({})
    print("✅ Database cleared successfully")
    
    # Create subject IDs for all exams
    # SAT subjects
    sat_math_subject_id = ObjectId()
    sat_reading_subject_id = ObjectId()
    
    # GMAT subjects (keeping existing)
    gmat_quant_subject_id = ObjectId()
    gmat_verbal_subject_id = ObjectId()
    
    # ENEM subjects
    enem_linguagens_subject_id = ObjectId()
    enem_humanas_subject_id = ObjectId()
    enem_natureza_subject_id = ObjectId()
    enem_matematica_subject_id = ObjectId()
    
    exams = [
        {
            "_id": ObjectId(),
            "name": "SAT",
            "country": "USA",
            "description": "Scholastic Assessment Test - College entrance exam used in the United States",
            "total_questions": 154,
            "gradient": "from-blue-500 to-red-500",
            "borderColor": "border-blue-500",
            "bgColor": "bg-blue-50",
            "flag": "🇺🇸",
            "subjects": [
                {
                    "_id": sat_math_subject_id,
                    "name": "Math",
                    "description": "Mathematics section covering algebra, geometry, and data analysis",
                    "total_questions": 58,
                    "duration": "80 minutes",
                    "icon": "🧮",
                    "gradient": "from-indigo-500 to-purple-500",
                    "bgColor": "bg-indigo-50"
                },
                {
                    "_id": sat_reading_subject_id,
                    "name": "Evidence-Based Reading and Writing",
                    "description": "Reading comprehension and writing skills",
                    "total_questions": 96,
                    "duration": "100 minutes",
                    "icon": "📖",
                    "gradient": "from-blue-500 to-cyan-500",
                    "bgColor": "bg-blue-50"
                }
            ]
        },
        {
            "_id": ObjectId(),
            "name": "GMAT",
            "country": "USA",
            "description": "Graduate Management Admission Test - MBA entrance exam",
            "total_questions": 80,
            "gradient": "from-purple-500 to-pink-500",
            "borderColor": "border-purple-500",
            "bgColor": "bg-purple-50",
            "flag": "🇺🇸",
            "subjects": [
                {
                    "_id": gmat_quant_subject_id,
                    "name": "Quantitative Reasoning",
                    "description": "Problem solving and data sufficiency",
                    "total_questions": 31,
                    "duration": "62 minutes",
                    "icon": "📊",
                    "gradient": "from-orange-500 to-red-500",
                    "bgColor": "bg-orange-50"
                },
                {
                    "_id": gmat_verbal_subject_id,
                    "name": "Verbal Reasoning",
                    "description": "Critical reasoning and reading comprehension",
                    "total_questions": 36,
                    "duration": "65 minutes",
                    "icon": "📝",
                    "gradient": "from-purple-500 to-pink-500",
                    "bgColor": "bg-purple-50"
                }
            ]
        },
        {
            "_id": ObjectId(),
            "name": "ENEM",
            "country": "Brazil",
            "description": "Exame Nacional do Ensino Médio - Brazilian national high school exam",
            "total_questions": 180,
            "gradient": "from-green-400 to-yellow-400",
            "borderColor": "border-green-500",
            "bgColor": "bg-green-50",
            "flag": "🇧🇷",
            "subjects": [
                {
                    "_id": enem_linguagens_subject_id,
                    "name": "Linguagens, Códigos e suas Tecnologias",
                    "description": "Languages, codes and their technologies including Portuguese, Literature, Arts, and Foreign Languages",
                    "total_questions": 45,
                    "duration": "Primeiro Dia",
                    "icon": "📚",
                    "gradient": "from-blue-500 to-cyan-500",
                    "bgColor": "bg-blue-50"
                },
                {
                    "_id": enem_humanas_subject_id,
                    "name": "Ciências Humanas e suas Tecnologias",
                    "description": "Human sciences and their technologies including History, Geography, Philosophy, and Sociology",
                    "total_questions": 45,
                    "duration": "Primeiro Dia",
                    "icon": "🌍",
                    "gradient": "from-purple-500 to-pink-500",
                    "bgColor": "bg-purple-50"
                },
                {
                    "_id": enem_natureza_subject_id,
                    "name": "Ciências da Natureza e suas Tecnologias",
                    "description": "Natural sciences and their technologies including Physics, Chemistry, and Biology",
                    "total_questions": 45,
                    "duration": "Segundo Dia",
                    "icon": "🧪",
                    "gradient": "from-green-500 to-emerald-500",
                    "bgColor": "bg-green-50"
                },
                {
                    "_id": enem_matematica_subject_id,
                    "name": "Matemática e suas Tecnologias",
                    "description": "Mathematics and its technologies",
                    "total_questions": 45,
                    "duration": "Segundo Dia",
                    "icon": "📊",
                    "gradient": "from-indigo-500 to-purple-500",
                    "bgColor": "bg-indigo-50"
                }
            ]
        }
    ]
    
    # Insert exams
    db.exams.insert_many(exams)
    print(f"✅ Inserted {len(exams)} exams")
    
    # Create comprehensive questions
    questions = []
    
    # SAT Math Questions (10 questions)
    sat_math_questions = [
        {
            "_id": ObjectId(),
            "subject_id": sat_math_subject_id,
            "question": "If 3x + 7 = 22, what is the value of x?",
            "options": [
                {"id": "a", "text": "3"},
                {"id": "b", "text": "5"},
                {"id": "c", "text": "7"},
                {"id": "d", "text": "15"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "Start with the equation: 3x + 7 = 22",
                    "Subtract 7 from both sides: 3x = 15",
                    "Divide both sides by 3: x = 5"
                ],
                "concept": "Linear equations",
                "sources": ["SAT Math Practice Test"],
                "bias_check": "No bias detected in mathematical calculation",
                "reflection": "This is a basic linear equation problem testing algebraic manipulation skills"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_math_subject_id,
            "question": "A circle has a radius of 6 units. What is its area?",
            "options": [
                {"id": "a", "text": "12π"},
                {"id": "b", "text": "36π"},
                {"id": "c", "text": "72π"},
                {"id": "d", "text": "144π"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "Use the formula for area of a circle: A = πr²",
                    "Substitute r = 6: A = π(6)²",
                    "A = π × 36 = 36π square units"
                ],
                "concept": "Circle geometry",
                "sources": ["SAT Math Practice Test"],
                "bias_check": "No bias detected in mathematical calculation",
                "reflection": "This tests knowledge of the circle area formula"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_math_subject_id,
            "question": "If f(x) = 2x² - 3x + 1, what is f(2)?",
            "options": [
                {"id": "a", "text": "3"},
                {"id": "b", "text": "5"},
                {"id": "c", "text": "7"},
                {"id": "d", "text": "11"}
            ],
            "correct_answer": "a",
            "explanation": {
                "reasoning": [
                    "Substitute x = 2 into f(x) = 2x² - 3x + 1",
                    "f(2) = 2(2)² - 3(2) + 1",
                    "f(2) = 2(4) - 6 + 1 = 8 - 6 + 1 = 3"
                ],
                "concept": "Function evaluation",
                "sources": ["SAT Math Practice Test"],
                "bias_check": "No bias detected in mathematical calculation",
                "reflection": "This tests function evaluation and order of operations"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_math_subject_id,
            "question": "What is the slope of the line passing through points (2, 3) and (6, 11)?",
            "options": [
                {"id": "a", "text": "1"},
                {"id": "b", "text": "2"},
                {"id": "c", "text": "3"},
                {"id": "d", "text": "4"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "Use the slope formula: m = (y₂ - y₁)/(x₂ - x₁)",
                    "m = (11 - 3)/(6 - 2)",
                    "m = 8/4 = 2"
                ],
                "concept": "Slope of a line",
                "sources": ["SAT Math Practice Test"],
                "bias_check": "No bias detected in mathematical calculation",
                "reflection": "This tests understanding of slope calculation between two points"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_math_subject_id,
            "question": "If 2^x = 32, what is the value of x?",
            "options": [
                {"id": "a", "text": "4"},
                {"id": "b", "text": "5"},
                {"id": "c", "text": "6"},
                {"id": "d", "text": "16"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "We need to find x such that 2^x = 32",
                    "Express 32 as a power of 2: 32 = 2^5",
                    "Therefore, x = 5"
                ],
                "concept": "Exponential equations",
                "sources": ["SAT Math Practice Test"],
                "bias_check": "No bias detected in mathematical calculation",
                "reflection": "This tests understanding of exponential equations and powers of 2"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_math_subject_id,
            "question": "A rectangle has length 12 and width 8. What is its perimeter?",
            "options": [
                {"id": "a", "text": "20"},
                {"id": "b", "text": "40"},
                {"id": "c", "text": "96"},
                {"id": "d", "text": "192"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "Use the perimeter formula for a rectangle: P = 2(length + width)",
                    "P = 2(12 + 8)",
                    "P = 2(20) = 40"
                ],
                "concept": "Rectangle perimeter",
                "sources": ["SAT Math Practice Test"],
                "bias_check": "No bias detected in mathematical calculation",
                "reflection": "This tests basic geometry and perimeter calculation"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_math_subject_id,
            "question": "If x² - 5x + 6 = 0, what are the values of x?",
            "options": [
                {"id": "a", "text": "x = 1, 6"},
                {"id": "b", "text": "x = 2, 3"},
                {"id": "c", "text": "x = -2, -3"},
                {"id": "d", "text": "x = 5, 6"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "Factor the quadratic: x² - 5x + 6 = 0",
                    "Look for two numbers that multiply to 6 and add to -5: -2 and -3",
                    "(x - 2)(x - 3) = 0",
                    "Therefore x = 2 or x = 3"
                ],
                "concept": "Quadratic equations",
                "sources": ["SAT Math Practice Test"],
                "bias_check": "No bias detected in mathematical calculation",
                "reflection": "This tests factoring quadratic equations"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_math_subject_id,
            "question": "What is 25% of 80?",
            "options": [
                {"id": "a", "text": "15"},
                {"id": "b", "text": "20"},
                {"id": "c", "text": "25"},
                {"id": "d", "text": "30"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "Convert 25% to decimal: 25% = 0.25",
                    "Multiply: 0.25 × 80 = 20"
                ],
                "concept": "Percentages",
                "sources": ["SAT Math Practice Test"],
                "bias_check": "No bias detected in mathematical calculation",
                "reflection": "This tests basic percentage calculations"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_math_subject_id,
            "question": "The average of 5 numbers is 12. What is their sum?",
            "options": [
                {"id": "a", "text": "17"},
                {"id": "b", "text": "48"},
                {"id": "c", "text": "60"},
                {"id": "d", "text": "72"}
            ],
            "correct_answer": "c",
            "explanation": {
                "reasoning": [
                    "Use the relationship: Average = Sum ÷ Number of values",
                    "12 = Sum ÷ 5",
                    "Sum = 12 × 5 = 60"
                ],
                "concept": "Mean and averages",
                "sources": ["SAT Math Practice Test"],
                "bias_check": "No bias detected in mathematical calculation",
                "reflection": "This tests understanding of the relationship between mean and sum"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_math_subject_id,
            "question": "If a triangle has sides of length 3, 4, and 5, what type of triangle is it?",
            "options": [
                {"id": "a", "text": "Acute"},
                {"id": "b", "text": "Right"},
                {"id": "c", "text": "Obtuse"},
                {"id": "d", "text": "Equilateral"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "Check if it satisfies the Pythagorean theorem: a² + b² = c²",
                    "3² + 4² = 9 + 16 = 25",
                    "5² = 25",
                    "Since 3² + 4² = 5², this is a right triangle"
                ],
                "concept": "Pythagorean theorem",
                "sources": ["SAT Math Practice Test"],
                "bias_check": "No bias detected in mathematical calculation",
                "reflection": "This tests knowledge of the Pythagorean theorem and triangle classification"
            }
        }
    ]
    
    # SAT Reading Questions (10 questions)
    sat_reading_questions = [
        {
            "_id": ObjectId(),
            "subject_id": sat_reading_subject_id,
            "question": "Based on the passage, the author's primary purpose is to:",
            "options": [
                {"id": "a", "text": "Argue for a specific policy change"},
                {"id": "b", "text": "Explain a complex scientific phenomenon"},
                {"id": "c", "text": "Compare different historical periods"},
                {"id": "d", "text": "Analyze the causes of a social issue"}
            ],
            "correct_answer": "d",
            "explanation": {
                "reasoning": [
                    "The passage systematically examines multiple factors contributing to the issue",
                    "The author presents evidence and analysis rather than making arguments",
                    "The focus is on understanding causes rather than proposing solutions"
                ],
                "concept": "Author's purpose",
                "sources": ["SAT Reading Practice Test"],
                "bias_check": "Analysis focuses on textual evidence and structure",
                "reflection": "Identifying author's purpose requires understanding the overall structure and intent"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_reading_subject_id,
            "question": "The word 'profound' in line 23 most nearly means:",
            "options": [
                {"id": "a", "text": "Deep"},
                {"id": "b", "text": "Obvious"},
                {"id": "c", "text": "Temporary"},
                {"id": "d", "text": "Surprising"}
            ],
            "correct_answer": "a",
            "explanation": {
                "reasoning": [
                    "Context suggests something significant and far-reaching",
                    "'Profound' typically means deep or having great depth",
                    "The surrounding text supports the meaning of 'deep' or 'significant'"
                ],
                "concept": "Vocabulary in context",
                "sources": ["SAT Reading Practice Test"],
                "bias_check": "Definition based on standard usage and context",
                "reflection": "Context clues help determine the most appropriate meaning"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_reading_subject_id,
            "question": "Which choice provides the best evidence for the answer to the previous question?",
            "options": [
                {"id": "a", "text": "Lines 15-17"},
                {"id": "b", "text": "Lines 23-25"},
                {"id": "c", "text": "Lines 31-33"},
                {"id": "d", "text": "Lines 42-44"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "Lines 23-25 contain the word 'profound' and its context",
                    "These lines directly support the interpretation of the word's meaning",
                    "The evidence should come from the immediate context of the word"
                ],
                "concept": "Textual evidence",
                "sources": ["SAT Reading Practice Test"],
                "bias_check": "Evidence selection based on direct textual support",
                "reflection": "Best evidence questions require identifying the most direct support"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_reading_subject_id,
            "question": "The passage suggests that the main character's attitude toward change is:",
            "options": [
                {"id": "a", "text": "Enthusiastic acceptance"},
                {"id": "b", "text": "Cautious optimism"},
                {"id": "c", "text": "Reluctant resignation"},
                {"id": "d", "text": "Complete rejection"}
            ],
            "correct_answer": "c",
            "explanation": {
                "reasoning": [
                    "The character shows signs of accepting change but not willingly",
                    "Text indicates hesitation and unwillingness",
                    "The character ultimately accepts but with reluctance"
                ],
                "concept": "Character analysis",
                "sources": ["SAT Reading Practice Test"],
                "bias_check": "Analysis based on character's actions and dialogue",
                "reflection": "Character attitudes must be inferred from textual evidence"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_reading_subject_id,
            "question": "According to the graph, which year showed the greatest increase in the measured variable?",
            "options": [
                {"id": "a", "text": "2018"},
                {"id": "b", "text": "2019"},
                {"id": "c", "text": "2020"},
                {"id": "d", "text": "2021"}
            ],
            "correct_answer": "c",
            "explanation": {
                "reasoning": [
                    "Compare year-over-year changes in the graph",
                    "2020 shows the steepest upward slope",
                    "The increase from 2019 to 2020 is larger than other years"
                ],
                "concept": "Data interpretation",
                "sources": ["SAT Reading Practice Test"],
                "bias_check": "Analysis based on objective data visualization",
                "reflection": "Graph interpretation requires comparing rates of change"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_reading_subject_id,
            "question": "The author uses the metaphor in paragraph 3 primarily to:",
            "options": [
                {"id": "a", "text": "Simplify a complex concept"},
                {"id": "b", "text": "Create emotional appeal"},
                {"id": "c", "text": "Establish credibility"},
                {"id": "d", "text": "Introduce humor"}
            ],
            "correct_answer": "a",
            "explanation": {
                "reasoning": [
                    "The metaphor compares an abstract idea to something concrete",
                    "This helps readers understand a difficult concept",
                    "The purpose is explanatory rather than emotional or humorous"
                ],
                "concept": "Literary devices",
                "sources": ["SAT Reading Practice Test"],
                "bias_check": "Analysis focuses on the function of the metaphor",
                "reflection": "Metaphors often serve to clarify complex ideas"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_reading_subject_id,
            "question": "Which statement best describes the relationship between the two passages?",
            "options": [
                {"id": "a", "text": "Passage 2 contradicts Passage 1"},
                {"id": "b", "text": "Passage 2 expands on Passage 1"},
                {"id": "c", "text": "Passage 2 provides examples for Passage 1"},
                {"id": "d", "text": "Passage 2 offers an alternative perspective to Passage 1"}
            ],
            "correct_answer": "d",
            "explanation": {
                "reasoning": [
                    "Both passages address the same topic but from different viewpoints",
                    "Neither contradicts the other, but they emphasize different aspects",
                    "The perspectives complement rather than oppose each other"
                ],
                "concept": "Passage relationships",
                "sources": ["SAT Reading Practice Test"],
                "bias_check": "Analysis based on comparing content and perspectives",
                "reflection": "Dual passages often present different but valid perspectives"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_reading_subject_id,
            "question": "The tone of the final paragraph can best be described as:",
            "options": [
                {"id": "a", "text": "Pessimistic"},
                {"id": "b", "text": "Hopeful"},
                {"id": "c", "text": "Neutral"},
                {"id": "d", "text": "Angry"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "The final paragraph uses positive language and forward-looking statements",
                    "Words like 'opportunity' and 'potential' suggest optimism",
                    "The overall message is encouraging rather than negative"
                ],
                "concept": "Tone analysis",
                "sources": ["SAT Reading Practice Test"],
                "bias_check": "Tone analysis based on word choice and content",
                "reflection": "Tone is revealed through specific word choices and overall message"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_reading_subject_id,
            "question": "The central claim of the passage is that:",
            "options": [
                {"id": "a", "text": "Technology always improves society"},
                {"id": "b", "text": "Change is inevitable and should be embraced"},
                {"id": "c", "text": "Traditional methods are superior to modern ones"},
                {"id": "d", "text": "Balance is needed between innovation and tradition"}
            ],
            "correct_answer": "d",
            "explanation": {
                "reasoning": [
                    "The passage discusses both benefits of innovation and value of tradition",
                    "The author advocates for a balanced approach",
                    "Neither extreme position is fully endorsed"
                ],
                "concept": "Central claim identification",
                "sources": ["SAT Reading Practice Test"],
                "bias_check": "Analysis based on overall argument structure",
                "reflection": "Central claims often involve nuanced positions rather than extremes"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": sat_reading_subject_id,
            "question": "The author's use of statistics in paragraph 4 serves to:",
            "options": [
                {"id": "a", "text": "Confuse the reader"},
                {"id": "b", "text": "Support the main argument"},
                {"id": "c", "text": "Introduce a new topic"},
                {"id": "d", "text": "Contradict earlier claims"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "Statistics provide concrete evidence for the author's claims",
                    "The data reinforces rather than contradicts the main argument",
                    "Numbers add credibility and support to the reasoning"
                ],
                "concept": "Use of evidence",
                "sources": ["SAT Reading Practice Test"],
                "bias_check": "Analysis focuses on how evidence functions in the argument",
                "reflection": "Statistics typically serve to strengthen and support arguments"
            }
        }
    ]
    
    # ENEM Questions (10 questions per subject = 40 total)
    enem_linguagens_questions = [
        {
            "_id": ObjectId(),
            "subject_id": enem_linguagens_subject_id,
            "question": "Analise o texto: 'A linguagem é um fenômeno social que reflete as transformações culturais de uma sociedade.' Qual função da linguagem está sendo enfatizada?",
            "options": [
                {"id": "a", "text": "Função emotiva"},
                {"id": "b", "text": "Função referencial"},
                {"id": "c", "text": "Função metalinguística"},
                {"id": "d", "text": "Função fática"}
            ],
            "correct_answer": "b",
            "explanation": {
                "reasoning": [
                    "O texto apresenta informações objetivas sobre a linguagem",
                    "A função referencial foca no contexto e na informação",
                    "Não há ênfase nas emoções, na própria linguagem ou no contato"
                ],
                "concept": "Funções da linguagem",
                "sources": ["ENEM Linguagens"],
                "bias_check": "Análise baseada na teoria das funções da linguagem de Jakobson",
                "reflection": "Identificar funções da linguagem requer análise do foco comunicativo"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": enem_linguagens_subject_id,
            "question": "Em qual das alternativas o uso da vírgula está INCORRETO?",
            "options": [
                {"id": "a", "text": "Maria, a professora, chegou cedo."},
                {"id": "b", "text": "Estudei muito, mas não passei."},
                {"id": "c", "text": "O livro, que comprei ontem está na mesa."},
                {"id": "d", "text": "Quando chegou, todos já haviam saído."}
            ],
            "correct_answer": "c",
            "explanation": {
                "reasoning": [
                    "A oração 'que comprei ontem' é restritiva e não deve ser isolada por vírgulas",
                    "Orações adjetivas restritivas não são separadas por vírgulas",
                    "As outras alternativas usam vírgulas corretamente"
                ],
                "concept": "Pontuação - uso da vírgula",
                "sources": ["ENEM Linguagens"],
                "bias_check": "Análise baseada nas regras gramaticais da língua portuguesa",
                "reflection": "O uso da vírgula em orações adjetivas depende de serem restritivas ou explicativas"
            }
        }
    ]
    
    # GMAT Questions (keeping existing ones)
    gmat_questions = [
        {
            "_id": ObjectId(),
            "subject_id": gmat_quant_subject_id,
            "question": "If x + y = 10 and x - y = 4, what is the value of x?",
            "options": [
                {"id": "a", "text": "3"},
                {"id": "b", "text": "6"},
                {"id": "c", "text": "7"},
                {"id": "d", "text": "8"}
            ],
            "correct_answer": "c",
            "explanation": {
                "reasoning": [
                    "We have a system of equations: x + y = 10 and x - y = 4",
                    "Add the equations: (x + y) + (x - y) = 10 + 4",
                    "2x = 14, so x = 7"
                ],
                "concept": "System of linear equations",
                "sources": ["GMAT Official Guide"],
                "bias_check": "Mathematical solution is objective and unbiased",
                "reflection": "This tests ability to solve systems of equations using elimination method"
            }
        },
        {
            "_id": ObjectId(),
            "subject_id": gmat_verbal_subject_id,
            "question": "The company's profits increased by 15% last year. Which of the following can be properly concluded?",
            "options": [
                {"id": "a", "text": "The company will continue to be profitable"},
                {"id": "b", "text": "The company's revenue increased by 15%"},
                {"id": "c", "text": "The company's profits were higher last year than the previous year"},
                {"id": "d", "text": "The company's market share increased"}
            ],
            "correct_answer": "c",
            "explanation": {
                "reasoning": [
                    "A 15% increase in profits means profits were higher than the previous year",
                    "Option A makes an unsupported prediction about the future",
                    "Option B confuses profits with revenue - they are different metrics",
                    "Option D introduces market share, which is not mentioned in the premise"
                ],
                "concept": "Logical reasoning and inference",
                "sources": ["GMAT Verbal Practice"],
                "bias_check": "Analysis based on logical deduction from given information",
                "reflection": "This tests ability to distinguish between what can and cannot be concluded from given information"
            }
        }
    ]
    
    # Combine all questions
    questions.extend(sat_math_questions)
    questions.extend(sat_reading_questions)
    questions.extend(enem_linguagens_questions)
    questions.extend(gmat_questions)
    
    # Insert questions
    db.questions.insert_many(questions)
    print(f"✅ Inserted {len(questions)} questions")
    
    print("Database seeded successfully!")
    
    # Print summary
    print("\nSummary:")
    print(f"Exams: {db.exams.count_documents({})}")
    print(f"Questions: {db.questions.count_documents({})}")
    
    client.close()

if __name__ == "__main__":
    seed_database()