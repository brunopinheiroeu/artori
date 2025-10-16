#!/usr/bin/env python3
"""
Sample script demonstrating how to use the subject-specific RAG functionality.

This script shows how to:
1. Ingest documents for specific subjects
2. Query the RAG system for subject-specific information
3. Get statistics for subject collections
"""

import asyncio
import logging
from pathlib import Path
from data_ingestion import ingestion_pipeline
from rag_service import rag_service
from ai_service import ai_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def demonstrate_subject_rag():
    """Demonstrate subject-specific RAG functionality"""
    
    print("🚀 Subject-Specific RAG Demonstration")
    print("=" * 50)
    
    # 1. Check available sample knowledge base files
    sample_kb_path = Path("sample_knowledge_base")
    if sample_kb_path.exists():
        print(f"\n📁 Available sample files in {sample_kb_path}:")
        for file in sample_kb_path.glob("*"):
            print(f"  - {file.name}")
    
    # 2. Ingest documents for specific subjects
    print("\n📚 Ingesting documents for specific subjects...")
    
    # Example: Ingest mathematics documents
    math_files = [
        "sample_knowledge_base/mathematics_algebra.json",
        "sample_knowledge_base/matematica_geometria.json"
    ]
    
    for file_path in math_files:
        if Path(file_path).exists():
            print(f"  📖 Ingesting {file_path} for Mathematics...")
            success = ingestion_pipeline.ingest_from_file(
                file_path=file_path,
                metadata={"subject": "mathematics", "content_language": "en"},
                subject="mathematics"
            )
            print(f"    {'✅ Success' if success else '❌ Failed'}")
    
    # Example: Ingest physics documents
    physics_files = [
        "sample_knowledge_base/physics_mechanics.json"
    ]
    
    for file_path in physics_files:
        if Path(file_path).exists():
            print(f"  🔬 Ingesting {file_path} for Physics...")
            success = ingestion_pipeline.ingest_from_file(
                file_path=file_path,
                metadata={"subject": "physics", "content_language": "en"},
                subject="physics"
            )
            print(f"    {'✅ Success' if success else '❌ Failed'}")
    
    # Example: Ingest chemistry documents
    chemistry_files = [
        "sample_knowledge_base/quimica_atomos.json"
    ]
    
    for file_path in chemistry_files:
        if Path(file_path).exists():
            print(f"  ⚗️ Ingesting {file_path} for Chemistry...")
            success = ingestion_pipeline.ingest_from_file(
                file_path=file_path,
                metadata={"subject": "chemistry", "content_language": "es"},
                subject="chemistry"
            )
            print(f"    {'✅ Success' if success else '❌ Failed'}")
    
    # 3. Get collection statistics
    print("\n📊 Collection Statistics:")
    subjects = ["mathematics", "physics", "chemistry", None]  # None for default collection
    
    for subject in subjects:
        stats = rag_service.get_collection_stats(subject)
        subject_name = subject.title() if subject else "Default"
        print(f"  📈 {subject_name}: {stats.get('total_documents', 0)} documents")
    
    # 4. Get all available subjects
    print("\n🎯 Available subjects:")
    all_subjects = rag_service.get_all_subjects()
    for subject in all_subjects:
        print(f"  - {subject}")
    
    # 5. Test RAG queries for different subjects
    print("\n🤖 Testing RAG queries for different subjects:")
    
    # Mathematics query
    if rag_service.is_available("mathematics"):
        print("\n  🔢 Mathematics Query:")
        math_response = rag_service.query(
            question="What is algebra and how do you solve linear equations?",
            interface_language="en",
            subject="mathematics",
            max_results=3
        )
        print(f"    Answer: {math_response.get('answer', 'No answer')[:100]}...")
        print(f"    Sources: {len(math_response.get('sources', []))} documents")
        print(f"    Confidence: {math_response.get('confidence', 0):.2f}")
    
    # Physics query
    if rag_service.is_available("physics"):
        print("\n  ⚡ Physics Query:")
        physics_response = rag_service.query(
            question="Explain Newton's laws of motion",
            interface_language="en",
            subject="physics",
            max_results=3
        )
        print(f"    Answer: {physics_response.get('answer', 'No answer')[:100]}...")
        print(f"    Sources: {len(physics_response.get('sources', []))} documents")
        print(f"    Confidence: {physics_response.get('confidence', 0):.2f}")
    
    # Chemistry query
    if rag_service.is_available("chemistry"):
        print("\n  🧪 Chemistry Query:")
        chemistry_response = rag_service.query(
            question="¿Qué son los átomos y cómo están estructurados?",
            interface_language="es",
            subject="chemistry",
            max_results=3
        )
        print(f"    Answer: {chemistry_response.get('answer', 'No answer')[:100]}...")
        print(f"    Sources: {len(chemistry_response.get('sources', []))} documents")
        print(f"    Confidence: {chemistry_response.get('confidence', 0):.2f}")
    
    # 6. Test AI service with RAG enhancement
    print("\n🎓 Testing AI service with RAG enhancement:")
    
    if ai_service.is_available() and ai_service.is_rag_available("mathematics"):
        print("\n  🤖 AI-Enhanced Mathematics Explanation:")
        
        # Sample question data
        sample_question = "What is the solution to the equation 2x + 5 = 15?"
        sample_options = [
            {"id": "A", "text": "x = 5"},
            {"id": "B", "text": "x = 10"},
            {"id": "C", "text": "x = 7.5"},
            {"id": "D", "text": "x = 2.5"}
        ]
        
        explanation = await ai_service.generate_rag_explanation(
            question=sample_question,
            options=sample_options,
            correct_answer="A",
            selected_answer="B",  # Student got it wrong
            subject="mathematics",
            difficulty="medium",
            interface_language="en",
            content_language="en"
        )
        
        print(f"    RAG Enhanced: {explanation.get('rag_enhanced', False)}")
        print(f"    Confidence: {explanation.get('confidence', 0):.2f}")
        print(f"    Retrieved Chunks: {explanation.get('retrieved_chunks', 0)}")
        print(f"    Reasoning Steps: {len(explanation.get('reasoning', []))}")
        if explanation.get('reasoning'):
            print(f"    First Reasoning: {explanation['reasoning'][0][:80]}...")
    
    print("\n✅ Subject-specific RAG demonstration completed!")
    print("\n💡 Key Features Implemented:")
    print("  - Subject-specific ChromaDB collections")
    print("  - Automatic subject-based document routing")
    print("  - Subject-aware RAG queries")
    print("  - Multilingual support per subject")
    print("  - Enhanced AI explanations with subject context")

def main():
    """Main function to run the demonstration"""
    try:
        asyncio.run(demonstrate_subject_rag())
    except KeyboardInterrupt:
        print("\n⏹️ Demonstration interrupted by user")
    except Exception as e:
        logger.error(f"❌ Error during demonstration: {e}")
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()