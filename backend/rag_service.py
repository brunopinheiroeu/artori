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
        self.vectorstores = {}  # Dictionary to store subject-specific vectorstores
        self.qa_chains = {}     # Dictionary to store subject-specific QA chains
        self.client = None
        self.default_collection = "artori"  # Default collection name
        
        # Initialize components
        self._initialize_embeddings()
        self._initialize_client()
        
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
    
    def _initialize_client(self):
        """Initialize ChromaDB client"""
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
                
                logger.info("✅ ChromaDB client (cloud) initialized successfully")
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
                
                logger.info("✅ ChromaDB client (local) initialized successfully")
                
        except Exception as e:
            logger.error(f"❌ Failed to initialize ChromaDB client: {e}")
            raise
    
    def _get_collection_name(self, subject: str = None) -> str:
        """Get collection name for a subject"""
        if subject:
            # Normalize subject name for collection naming
            normalized_subject = subject.lower().replace(" ", "_").replace("-", "_")
            return f"artori_{normalized_subject}"
        return self.default_collection
    
    def _get_vectorstore(self, subject: str = None) -> Optional[Chroma]:
        """Get or create vectorstore for a subject"""
        collection_name = self._get_collection_name(subject)
        
        if collection_name not in self.vectorstores:
            try:
                # Check if we're using cloud or local
                chroma_api_key = os.getenv("CHROMA_API_KEY")
                
                if chroma_api_key:
                    # Cloud: no persist_directory
                    vectorstore = Chroma(
                        client=self.client,
                        collection_name=collection_name,
                        embedding_function=self.embeddings
                    )
                else:
                    # Local: with persist_directory
                    vectorstore = Chroma(
                        client=self.client,
                        collection_name=collection_name,
                        embedding_function=self.embeddings,
                        persist_directory=self.persist_directory
                    )
                
                self.vectorstores[collection_name] = vectorstore
                logger.info(f"✅ Vectorstore for collection '{collection_name}' initialized")
                
            except Exception as e:
                logger.error(f"❌ Failed to initialize vectorstore for collection '{collection_name}': {e}")
                return None
        
        return self.vectorstores[collection_name]
    
    def _get_qa_chain(self, subject: str = None) -> Optional[RetrievalQA]:
        """Get or create QA chain for a subject"""
        collection_name = self._get_collection_name(subject)
        
        if collection_name not in self.qa_chains:
            try:
                api_key = os.getenv("OPENAI_API_KEY")
                if not api_key:
                    logger.warning("⚠️ OPENAI_API_KEY not found, QA chain will not be available")
                    return None
                
                vectorstore = self._get_vectorstore(subject)
                if not vectorstore:
                    return None
                
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
                qa_chain = RetrievalQA.from_chain_type(
                    llm=llm,
                    chain_type="stuff",
                    retriever=vectorstore.as_retriever(
                        search_type="similarity",
                        search_kwargs={"k": 4}  # Retrieve top 4 most relevant chunks
                    ),
                    chain_type_kwargs={"prompt": PROMPT},
                    return_source_documents=True
                )
                
                self.qa_chains[collection_name] = qa_chain
                logger.info(f"✅ QA chain for collection '{collection_name}' initialized")
                
            except Exception as e:
                logger.error(f"❌ Failed to initialize QA chain for collection '{collection_name}': {e}")
                return None
        
        return self.qa_chains[collection_name]
    
    def is_available(self, subject: str = None) -> bool:
        """Check if RAG service is available for a subject"""
        if self.embeddings is None or self.client is None:
            return False
        
        # For basic availability, just check if we can create a vectorstore
        vectorstore = self._get_vectorstore(subject)
        qa_chain = self._get_qa_chain(subject)
        
        return vectorstore is not None and qa_chain is not None
    
    def add_documents(self, documents: List[Document], subject: str = None) -> bool:
        """
        Add documents to the vectorstore for a specific subject
        
        Args:
            documents: List of LangChain Document objects
            subject: Subject to add documents to (optional, uses default if None)
            
        Returns:
            bool: Success status
        """
        try:
            if not documents:
                logger.warning("No documents provided to add")
                return False
            
            vectorstore = self._get_vectorstore(subject)
            if not vectorstore:
                logger.error(f"Failed to get vectorstore for subject: {subject}")
                return False
            
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
            )
            
            split_docs = text_splitter.split_documents(documents)
            
            # Add documents to vectorstore
            vectorstore.add_documents(split_docs)
            
            collection_name = self._get_collection_name(subject)
            logger.info(f"✅ Added {len(split_docs)} document chunks to collection '{collection_name}'")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to add documents to subject '{subject}': {e}")
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
        Query the RAG system for a specific subject
        
        Args:
            question: User's question
            interface_language: Language for AI responses/explanations (en, pt, es)
            content_language: Language of the original content/exam (optional filter)
            subject: Subject to query (uses subject-specific collection)
            max_results: Maximum number of results to retrieve
            
        Returns:
            Dictionary with answer and source information
        """
        if not self.is_available(subject):
            return self._get_fallback_response(question, interface_language)
        
        try:
            qa_chain = self._get_qa_chain(subject)
            if not qa_chain:
                return self._get_fallback_response(question, interface_language)
            
            # Update retriever with current parameters
            qa_chain.retriever.search_kwargs["k"] = max_results
            
            # Add content language filter if needed
            filter_dict = {}
            if content_language:
                filter_dict["content_language"] = content_language
            
            if filter_dict:
                qa_chain.retriever.search_kwargs["filter"] = filter_dict
            
            # Query the chain
            result = qa_chain({"query": question})
            
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
                "subject": subject,
                "retrieved_chunks": len(source_documents)
            }
            
            collection_name = self._get_collection_name(subject)
            logger.info(f"✅ RAG query processed successfully for collection '{collection_name}' with interface language: {interface_language}")
            return response
            
        except Exception as e:
            logger.error(f"❌ Failed to process RAG query for subject '{subject}': {e}")
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
    
    def get_collection_stats(self, subject: str = None) -> Dict[str, Any]:
        """Get statistics about the knowledge base for a subject"""
        try:
            if not self.client:
                return {"error": "ChromaDB client not initialized"}
            
            collection_name = self._get_collection_name(subject)
            
            try:
                collection = self.client.get_collection(collection_name)
                count = collection.count()
                
                return {
                    "total_documents": count,
                    "collection_name": collection_name,
                    "subject": subject,
                    "embedding_model": "paraphrase-multilingual-MiniLM-L12-v2"
                }
            except Exception as collection_error:
                # Collection might not exist yet
                return {
                    "total_documents": 0,
                    "collection_name": collection_name,
                    "subject": subject,
                    "embedding_model": "paraphrase-multilingual-MiniLM-L12-v2",
                    "note": "Collection not yet created"
                }
                
        except Exception as e:
            logger.error(f"Failed to get collection stats for subject '{subject}': {e}")
            return {"error": str(e)}
    
    def get_all_subjects(self) -> List[str]:
        """Get list of all subjects with collections"""
        try:
            if not self.client:
                return []
            
            collections = self.client.list_collections()
            subjects = []
            
            for collection in collections:
                name = collection.name
                if name.startswith("artori_"):
                    # Extract subject from collection name
                    subject = name.replace("artori_", "").replace("_", " ").title()
                    subjects.append(subject)
                elif name == self.default_collection:
                    subjects.append("General")
            
            return subjects
            
        except Exception as e:
            logger.error(f"Failed to get subjects list: {e}")
            return []

# Global RAG service instance
rag_service = RAGService()