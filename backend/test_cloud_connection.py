#!/usr/bin/env python3
"""
Test script to verify ChromaDB Cloud connection and data retrieval
"""

import os
import chromadb
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_cloud_connection():
    """Test ChromaDB Cloud connection and data retrieval"""
    
    # Get credentials
    chroma_api_key = os.getenv("CHROMA_API_KEY")
    chroma_tenant = os.getenv("CHROMA_TENANT")
    chroma_database = os.getenv("CHROMA_DATABASE")
    
    print(f"🔗 Connecting to ChromaDB Cloud...")
    print(f"   Tenant: {chroma_tenant}")
    print(f"   Database: {chroma_database}")
    
    try:
        # Connect to ChromaDB Cloud
        client = chromadb.CloudClient(
            api_key=chroma_api_key,
            tenant=chroma_tenant,
            database=chroma_database
        )
        
        # Get the collection
        collection = client.get_collection("artori")
        
        # Get collection stats
        count = collection.count()
        print(f"✅ Successfully connected to ChromaDB Cloud!")
        print(f"📊 Collection 'artori' contains {count} documents")
        
        # Test a simple query
        results = collection.query(
            query_texts=["What is the formula for calculating the area of a circle?"],
            n_results=3
        )
        
        print(f"\n🔍 Test Query Results:")
        print(f"   Found {len(results['documents'][0])} relevant documents")
        
        for i, doc in enumerate(results['documents'][0]):
            print(f"\n   Document {i+1}:")
            print(f"   Content: {doc[:100]}...")
            if results['metadatas'][0][i]:
                print(f"   Metadata: {results['metadatas'][0][i]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to connect to ChromaDB Cloud: {e}")
        return False

if __name__ == "__main__":
    test_cloud_connection()