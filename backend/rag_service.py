import os
import logging
from typing import Dict, List, Optional, Any
from pathlib import Path
import chromadb
from chromadb.config import Settings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

class RAGService:
    """RAG service for retrieval-augmented generation using LangChain and ChromaDB"""
    
    def __init__(self, persist_directory: str = "./chroma_db"):
        """
        Initialize the RAG service
        
        Args:
            persist_directory: Directory to persist ChromaDB data (used only for local development)
        """
        self.persist_directory = persist_directory
        self.embeddings = None
        self.vectorstore = None
        self.qa_chain = None
        self.client = None
        
        # Initialize components
        self._initialize_embeddings()
        self._initialize_vectorstore()
        self._initialize_qa_chain()
        
    def _initialize_embeddings(self):
        """Initialize the embedding model for multilingual support"""
        try:
            # Use a multilingual sentence transformer model
            self.embeddings = SentenceTransformerEmbeddings(
                model_name="paraphrase-multilingual-MiniLM-L12-v2"
            )
            logger.info("✅ Multilingual embeddings initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize embeddings: {e}")
            raise
    
    def _initialize_vectorstore(self):
        """Initialize ChromaDB vectorstore"""
        try:
            # Check if we should use ChromaDB Cloud
            chroma_api_key = os.getenv("CHROMA_API_KEY")
            chroma_tenant = os.getenv("CHROMA_TENANT")
            chroma_database = os.getenv("CHROMA_DATABASE")
            
            if chroma_api_key and chroma_tenant and chroma_database:
                # Production: Use CloudClient to connect to ChromaDB Cloud
                logger.info(f"☁️ Connecting to ChromaDB Cloud (tenant: {chroma_tenant}, database: {chroma_database})")
                
                # Use the newer ChromaDB Cloud API
                self.client = chromadb.CloudClient(
                    api_key=chroma_api_key,
                    tenant=chroma_tenant,
                    database=chroma_database
                )
                
                # Initialize Chroma vectorstore with LangChain (no persist_directory for cloud)
                self.vectorstore = Chroma(
                    client=self.client,
                    collection_name="artori",
                    embedding_function=self.embeddings
                )
                
                logger.info("✅ ChromaDB vectorstore (cloud) initialized successfully")
            else:
                # Local development: Use PersistentClient
                logger.info(f"💾 Using local ChromaDB at {self.persist_directory}")
                
                # Create persist directory if it doesn't exist
                Path(self.persist_directory).mkdir(parents=True, exist_ok=True)
                
                # Initialize ChromaDB client
                self.client = chromadb.PersistentClient(
                    path=self.persist_directory,
                    settings=Settings(anonymized_telemetry=False)
                )
                
                # Initialize Chroma vectorstore with LangChain
                self.vectorstore = Chroma(
                    client=self.client,
                    collection_name="artori",
                    embedding_function=self.embeddings,
                    persist_directory=self.persist_directory
                )
                
                logger.info("✅ ChromaDB vectorstore (local) initialized successfully")
                
        except Exception as e:
            logger.error(f"❌ Failed to initialize vectorstore: {e}")
            raise
    
    def _initialize_qa_chain(self):
        """Initialize the QA chain for generation"""
        try:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                logger.warning("⚠️ OPENAI_API_KEY not found, QA chain will not be available")
                return
            
            # Initialize OpenAI LLM
            llm = OpenAI(
                openai_api_key=api_key,
                temperature=0.7,
                max_tokens=500
            )
            
            # Create custom prompt template for educational content
            prompt_template = """You are an expert educational AI tutor. Use the following context to answer the student's question. 
            
            Context: {context}
            
            Question: {question}
            
            Instructions:
            - Provide a clear, educational answer based on the context
            - If the context doesn't contain enough information, say so clearly
            - Include specific references to the source material when possible
            - Keep the answer appropriate for educational purposes
            - Be encouraging and supportive in your tone
            
            Answer:"""
            
            PROMPT = PromptTemplate(
                template=prompt_template,
                input_variables=["context", "question"]
            )
            
            # Create retrieval QA chain
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=self.vectorstore.as_retriever(
                    search_type="similarity",
                    search_kwargs={"k": 4}  # Retrieve top 4 most relevant chunks
                ),
                chain_type_kwargs={"prompt": PROMPT},
                return_source_documents=True
            )
            
            logger.info("✅ QA chain initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize QA chain: {e}")
            self.qa_chain = None
    
    def is_available(self) -> bool:
        """Check if RAG service is available"""
        return (
            self.embeddings is not None and 
            self.vectorstore is not None and 
            self.qa_chain is not None
        )
    
    def add_documents(self, documents: List[Document]) -> bool:
        """
        Add documents to the vectorstore
        
        Args:
            documents: List of LangChain Document objects
            
        Returns:
            bool: Success status
        """
        try:
            if not documents:
                logger.warning("No documents provided to add")
                return False
            
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
            )
            
            split_docs = text_splitter.split_documents(documents)
            
            # Add documents to vectorstore
            self.vectorstore.add_documents(split_docs)
            
            logger.info(f"✅ Added {len(split_docs)} document chunks to vectorstore")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to add documents: {e}")
            return False
    
    def query(
        self,
        question: str,
        interface_language: str = "en",
        content_language: str = None,
        subject: str = None,
        max_results: int = 4
    ) -> Dict[str, Any]:
        """
        Query the RAG system
        
        Args:
            question: User's question
            interface_language: Language for AI responses/explanations (en, pt, es)
            content_language: Language of the original content/exam (optional filter)
            subject: Subject filter (optional)
            max_results: Maximum number of results to retrieve
            
        Returns:
            Dictionary with answer and source information
        """
        if not self.is_available():
            return self._get_fallback_response(question, interface_language)
        
        try:
            # Update retriever with current parameters
            self.qa_chain.retriever.search_kwargs["k"] = max_results
            
            # Add content language and subject filters if needed
            filter_dict = {}
            if content_language:
                filter_dict["content_language"] = content_language
            if subject:
                filter_dict["subject"] = subject
            
            if filter_dict:
                self.qa_chain.retriever.search_kwargs["filter"] = filter_dict
            
            # Query the chain
            result = self.qa_chain({"query": question})
            
            # Extract answer and sources
            answer = result["result"]
            source_documents = result.get("source_documents", [])
            
            # Format sources for explainability
            sources = []
            for doc in source_documents:
                source_info = {
                    "content": doc.page_content[:200] + "..." if len(doc.page_content) > 200 else doc.page_content,
                    "metadata": doc.metadata,
                    "similarity_score": getattr(doc, 'similarity_score', None)
                }
                sources.append(source_info)
            
            response = {
                "answer": answer,
                "sources": sources,
                "confidence": self._calculate_confidence(sources),
                "interface_language": interface_language,
                "content_language": content_language,
                "retrieved_chunks": len(source_documents)
            }
            
            logger.info(f"✅ RAG query processed successfully for interface language: {interface_language}")
            return response
            
        except Exception as e:
            logger.error(f"❌ Failed to process RAG query: {e}")
            return self._get_fallback_response(question, interface_language)
    
    def _calculate_confidence(self, sources: List[Dict]) -> float:
        """
        Calculate confidence score based on retrieved sources
        
        Args:
            sources: List of source documents
            
        Returns:
            Confidence score between 0 and 1
        """
        if not sources:
            return 0.0
        
        # Simple confidence calculation based on number of sources
        # In a production system, this could be more sophisticated
        base_confidence = min(len(sources) / 4.0, 1.0)  # Max confidence with 4+ sources
        
        # Adjust based on metadata quality
        metadata_bonus = 0.0
        for source in sources:
            if source.get("metadata", {}).get("subject"):
                metadata_bonus += 0.1
        
        return min(base_confidence + metadata_bonus, 1.0)
    
    def _get_fallback_response(self, question: str, language: str) -> Dict[str, Any]:
        """Get fallback response when RAG is unavailable"""
        fallback_messages = {
            "en": "I'm currently unable to access the knowledge base. Please try again later or consult your course materials.",
            "pt": "Atualmente não consigo acessar a base de conhecimento. Tente novamente mais tarde ou consulte seus materiais do curso.",
            "es": "Actualmente no puedo acceder a la base de conocimientos. Inténtalo de nuevo más tarde o consulta tus materiales del curso."
        }
        
        return {
            "answer": fallback_messages.get(language, fallback_messages["en"]),
            "sources": [],
            "confidence": 0.0,
            "language": language,
            "retrieved_chunks": 0,
            "fallback": True
        }
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the knowledge base"""
        try:
            if not self.client:
                return {"error": "ChromaDB client not initialized"}
            
            collection = self.client.get_collection("artori")
            count = collection.count()
            
            return {
                "total_documents": count,
                "collection_name": "artori",
                "embedding_model": "paraphrase-multilingual-MiniLM-L12-v2"
            }
        except Exception as e:
            logger.error(f"Failed to get collection stats: {e}")
            return {"error": str(e)}

# Global RAG service instance
rag_service = RAGService()