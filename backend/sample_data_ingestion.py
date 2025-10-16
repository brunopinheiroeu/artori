#!/usr/bin/env python3
"""
Sample data ingestion script for the Artori RAG system.

This script demonstrates how to ingest various types of educational content
into the ChromaDB knowledge base for the RAG-powered AI tutor.

Usage:
    python sample_data_ingestion.py
"""

import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, List

# Try to import dependencies, handle missing ones gracefully
try:
    from langchain.schema import Document
    from data_ingestion import ingestion_pipeline
    from rag_service import rag_service
    DEPENDENCIES_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Some dependencies are missing: {e}")
    print("Running in limited mode for testing purposes...")
    DEPENDENCIES_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_sample_educational_content():
    """Create sample educational content for demonstration"""
    
    # Create a sample data directory
    sample_dir = Path("sample_knowledge_base")
    sample_dir.mkdir(exist_ok=True)
    
    # Sample mathematics content (SAT-style, original language: English)
    math_content = {
        "subject": "Mathematics",
        "topic": "Algebra",
        "content_language": "en",  # Original exam language
        "exam_type": "SAT",
        "difficulty": "medium",
        "content": [
            {
                "question": "What is the solution to the equation 2x + 5 = 13?",
                "explanation": "To solve 2x + 5 = 13, we need to isolate x. First, subtract 5 from both sides: 2x = 8. Then divide both sides by 2: x = 4.",
                "concept": "Linear equations and algebraic manipulation",
                "steps": [
                    "Start with the equation: 2x + 5 = 13",
                    "Subtract 5 from both sides: 2x = 13 - 5 = 8",
                    "Divide both sides by 2: x = 8/2 = 4",
                    "Verify: 2(4) + 5 = 8 + 5 = 13 ✓"
                ]
            },
            {
                "question": "How do you factor x² - 5x + 6?",
                "explanation": "To factor x² - 5x + 6, we need to find two numbers that multiply to 6 and add to -5. These numbers are -2 and -3. So x² - 5x + 6 = (x - 2)(x - 3).",
                "concept": "Quadratic factoring",
                "steps": [
                    "Identify the quadratic: x² - 5x + 6",
                    "Find factors of 6 that add to -5: -2 and -3",
                    "Write as factors: (x - 2)(x - 3)",
                    "Verify: (x - 2)(x - 3) = x² - 3x - 2x + 6 = x² - 5x + 6 ✓"
                ]
            }
        ]
    }
    
    # Sample science content (AP Physics, original language: English)
    science_content = {
        "subject": "Physics",
        "topic": "Mechanics",
        "content_language": "en",  # Original exam language
        "exam_type": "AP Physics",
        "difficulty": "medium",
        "content": [
            {
                "question": "What is Newton's Second Law of Motion?",
                "explanation": "Newton's Second Law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The formula is F = ma, where F is force, m is mass, and a is acceleration.",
                "concept": "Force and acceleration relationship",
                "applications": [
                    "Calculating force needed to accelerate a car",
                    "Understanding why heavier objects need more force to accelerate",
                    "Analyzing motion in sports and engineering"
                ]
            },
            {
                "question": "How do you calculate kinetic energy?",
                "explanation": "Kinetic energy is the energy of motion. It's calculated using the formula KE = ½mv², where m is mass and v is velocity. The energy increases with the square of velocity.",
                "concept": "Energy and motion",
                "examples": [
                    "A 2kg ball moving at 5 m/s has KE = ½(2)(5²) = 25 J",
                    "Doubling speed quadruples kinetic energy",
                    "Used in collision analysis and energy conservation"
                ]
            }
        ]
    }
    
    # Sample Portuguese content (ENEM, original language: Portuguese)
    portuguese_content = {
        "subject": "Matemática",
        "topic": "Geometria",
        "content_language": "pt",  # Original exam language
        "exam_type": "ENEM",
        "difficulty": "medium",
        "content": [
            {
                "question": "Como calcular a área de um círculo?",
                "explanation": "A área de um círculo é calculada usando a fórmula A = πr², onde r é o raio do círculo. Pi (π) é aproximadamente 3,14159.",
                "concept": "Área de figuras geométricas",
                "steps": [
                    "Identifique o raio do círculo",
                    "Eleve o raio ao quadrado (r²)",
                    "Multiplique por π (pi)",
                    "A = π × r²"
                ]
            }
        ]
    }
    
    # Sample Spanish content (Selectividad, original language: Spanish)
    spanish_content = {
        "subject": "Química",
        "topic": "Átomos y Moléculas",
        "content_language": "es",  # Original exam language
        "exam_type": "Selectividad",
        "difficulty": "basic",
        "content": [
            {
                "question": "¿Qué es un átomo?",
                "explanation": "Un átomo es la unidad básica de la materia. Está compuesto por un núcleo central que contiene protones y neutrones, rodeado por electrones que orbitan en capas de energía.",
                "concept": "Estructura atómica básica",
                "components": [
                    "Núcleo: contiene protones (carga positiva) y neutrones (sin carga)",
                    "Electrones: partículas con carga negativa que orbitan el núcleo",
                    "El número de protones determina el elemento químico"
                ]
            }
        ]
    }
    
    # Save sample content as JSON files
    contents = [
        (math_content, "mathematics_algebra.json"),
        (science_content, "physics_mechanics.json"),
        (portuguese_content, "matematica_geometria.json"),
        (spanish_content, "quimica_atomos.json")
    ]
    
    for content, filename in contents:
        file_path = sample_dir / filename
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(content, f, indent=2, ensure_ascii=False)
        logger.info(f"Created sample file: {file_path}")
    
    # Create a sample text file
    text_content = """
    Introduction to Calculus

    Calculus is a branch of mathematics that deals with rates of change and accumulation of quantities.
    It has two main branches: differential calculus and integral calculus.

    Differential Calculus:
    - Studies rates of change and slopes of curves
    - Key concept: the derivative
    - Applications: optimization, motion analysis, marginal analysis

    Integral Calculus:
    - Studies accumulation of quantities and areas under curves
    - Key concept: the integral
    - Applications: area calculation, volume calculation, probability

    The Fundamental Theorem of Calculus connects these two branches, showing that
    differentiation and integration are inverse operations.

    Key Formulas:
    - Derivative of x^n: nx^(n-1)
    - Integral of x^n: x^(n+1)/(n+1) + C
    - Chain rule: d/dx[f(g(x))] = f'(g(x)) × g'(x)
    """
    
    text_file = sample_dir / "calculus_introduction.txt"
    with open(text_file, 'w', encoding='utf-8') as f:
        f.write(text_content)
    logger.info(f"Created sample text file: {text_file}")
    
    return sample_dir

def ingest_sample_data():
    """Ingest sample educational content into the RAG system"""
    
    logger.info("🚀 Starting sample data ingestion for Artori RAG system")
    
    # Create sample content
    sample_dir = create_sample_educational_content()
    
    # Check if RAG service is available
    if not rag_service.is_available():
        logger.error("❌ RAG service is not available. Please check your setup.")
        return False
    
    # Ingest the sample directory
    success = ingestion_pipeline.ingest_from_directory(
        directory_path=str(sample_dir),
        recursive=False,
        default_metadata={
            "source_type": "sample_data",
            "ingestion_date": "2024-01-01",
            "verified": True
        }
    )
    
    if success:
        logger.info("✅ Sample data ingestion completed successfully!")
        
        # Get collection statistics
        stats = rag_service.get_collection_stats()
        logger.info(f"📊 Knowledge base statistics: {stats}")
        
        # Test a sample query
        logger.info("🧪 Testing sample queries...")
        
        test_queries = [
            ("What is the solution to 2x + 5 = 13?", "en", "Mathematics"),
            ("Como calcular a área de um círculo?", "pt", "Matemática"),
            ("¿Qué es un átomo?", "es", "Química"),
            ("Explain Newton's Second Law", "en", "Physics")
        ]
        
        for query, lang, subject in test_queries:
            logger.info(f"Testing query: '{query}' (Language: {lang}, Subject: {subject})")
            
            try:
                response = rag_service.query(
                    question=query,
                    language=lang,
                    subject=subject.lower() if subject else None,
                    max_results=2
                )
                
                logger.info(f"✅ Query successful - Confidence: {response.get('confidence', 0):.2f}")
                logger.info(f"📝 Answer preview: {response.get('answer', '')[:100]}...")
                logger.info(f"📚 Sources found: {response.get('retrieved_chunks', 0)}")
                
            except Exception as e:
                logger.error(f"❌ Query failed: {e}")
        
        return True
    else:
        logger.error("❌ Sample data ingestion failed!")
        return False

def main():
    """Main function to run the sample data ingestion"""
    
    print("=" * 60)
    print("🎓 Artori RAG System - Sample Data Ingestion")
    print("=" * 60)
    
    try:
        success = ingest_sample_data()
        
        if success:
            print("\n✅ Sample data ingestion completed successfully!")
            print("\n📋 Next steps:")
            print("1. The RAG system is now ready with sample educational content")
            print("2. You can test it by calling ai_service.generate_rag_explanation()")
            print("3. Add your own educational content using the data_ingestion module")
            print("4. Monitor the knowledge base using rag_service.get_collection_stats()")
            
        else:
            print("\n❌ Sample data ingestion failed!")
            print("\n🔧 Troubleshooting:")
            print("1. Check that all dependencies are installed: pip install -r requirements.txt")
            print("2. Ensure OPENAI_API_KEY is set in your environment")
            print("3. Verify ChromaDB is working properly")
            
    except Exception as e:
        logger.error(f"Unexpected error during ingestion: {e}")
        print(f"\n💥 Unexpected error: {e}")
        print("Please check the logs for more details.")

def test_semantic_search():
    """Test the semantic search and retrieval functionality"""
    
    print("\n" + "=" * 60)
    print("🔍 Testing Semantic Search and Retrieval")
    print("=" * 60)
    
    try:
        # Import RAGService from rag_service module
        from rag_service import RAGService
        
        # Instantiate the RAGService
        rag_service = RAGService()
        
        # Check if the service is available
        if not rag_service.is_available():
            print("❌ RAG service is not available. Please ensure:")
            print("1. ChromaDB is properly initialized")
            print("2. OPENAI_API_KEY is set in your environment")
            print("3. Sample data has been ingested")
            return False
        
        print("✅ RAG service is available and ready for testing")
        
        # Define sample query
        sample_query = "What is the formula for calculating the area of a circle?"
        interface_language = 'en'
        content_language = 'en'
        
        print(f"\n🧪 Testing semantic search with query:")
        print(f"   Query: '{sample_query}'")
        print(f"   Interface Language: {interface_language}")
        print(f"   Content Language: {content_language}")
        
        # Perform the query using RAGService
        response = rag_service.query(
            question=sample_query,
            interface_language=interface_language,
            content_language=content_language,
            max_results=4
        )
        
        # Print the retrieved documents and results
        print(f"\n📊 Query Results:")
        print(f"   Confidence Score: {response.get('confidence', 0):.2f}")
        print(f"   Retrieved Chunks: {response.get('retrieved_chunks', 0)}")
        print(f"   Interface Language: {response.get('interface_language', 'N/A')}")
        print(f"   Content Language: {response.get('content_language', 'N/A')}")
        
        print(f"\n🤖 Generated Answer:")
        print(f"   {response.get('answer', 'No answer generated')}")
        
        print(f"\n📚 Retrieved Documents:")
        sources = response.get('sources', [])
        if sources:
            for i, source in enumerate(sources, 1):
                print(f"\n   Document {i}:")
                print(f"   Content: {source.get('content', 'No content')}")
                print(f"   Metadata: {source.get('metadata', {})}")
                if source.get('similarity_score'):
                    print(f"   Similarity Score: {source.get('similarity_score'):.4f}")
        else:
            print("   No documents retrieved")
        
        # Test additional queries to verify multilingual support
        additional_queries = [
            {
                "query": "Como calcular a área de um círculo?",
                "interface_language": "pt",
                "content_language": "pt",
                "description": "Portuguese query for circle area"
            },
            {
                "query": "Explain Newton's Second Law of Motion",
                "interface_language": "en",
                "content_language": "en",
                "description": "Physics query about Newton's law"
            }
        ]
        
        print(f"\n🌐 Testing Additional Multilingual Queries:")
        
        for test_case in additional_queries:
            print(f"\n   Testing: {test_case['description']}")
            print(f"   Query: '{test_case['query']}'")
            
            try:
                response = rag_service.query(
                    question=test_case['query'],
                    interface_language=test_case['interface_language'],
                    content_language=test_case['content_language'],
                    max_results=2
                )
                
                print(f"   ✅ Success - Confidence: {response.get('confidence', 0):.2f}")
                print(f"   Retrieved: {response.get('retrieved_chunks', 0)} chunks")
                print(f"   Answer Preview: {response.get('answer', '')[:100]}...")
                
            except Exception as e:
                print(f"   ❌ Failed: {e}")
        
        print(f"\n✅ Semantic search testing completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Error during semantic search testing: {e}")
        print(f"\n❌ Semantic search testing failed: {e}")
        return False

if __name__ == "__main__":
    # Run the main data ingestion
    main()
    
    # Test semantic search and retrieval
    test_semantic_search()