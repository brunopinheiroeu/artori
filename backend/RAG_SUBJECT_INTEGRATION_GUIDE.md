# Subject-Specific RAG Integration Guide

## Overview

This guide documents the implementation of subject-specific RAG (Retrieval-Augmented Generation) functionality in the Artori educational platform. The system now supports creating separate knowledge bases for different subjects, enabling more targeted and accurate AI responses.

## Key Features Implemented

### 1. Subject-Specific Collections

- **Dynamic Collection Names**: Collections are named using the pattern `artori_{subject}` (e.g., `artori_mathematics`, `artori_physics`)
- **Automatic Subject Routing**: Documents are automatically routed to the appropriate collection based on subject metadata
- **Fallback Support**: Default collection (`artori`) is used when no subject is specified

### 2. Enhanced Data Ingestion

- **Subject-Aware Ingestion**: Documents can be ingested into specific subject collections
- **Metadata-Based Routing**: Automatic subject detection from document metadata
- **Batch Processing**: Support for ingesting multiple subjects simultaneously

### 3. Targeted RAG Queries

- **Subject-Specific Retrieval**: Queries are executed against the relevant subject collection
- **Improved Accuracy**: More relevant results due to subject-focused knowledge bases
- **Multilingual Support**: Each subject can contain content in multiple languages

## Modified Files

### 1. `rag_service.py`

**Key Changes:**

- Replaced single vectorstore with dictionary of subject-specific vectorstores
- Added `_get_collection_name()` method for dynamic collection naming
- Updated `_get_vectorstore()` and `_get_qa_chain()` methods for subject support
- Modified `query()` method to use subject-specific collections
- Enhanced `is_available()` method to check subject-specific availability

**New Methods:**

```python
def _get_collection_name(self, subject: str = None) -> str
def _get_vectorstore(self, subject: str = None) -> Optional[Chroma]
def _get_qa_chain(self, subject: str = None) -> Optional[RetrievalQA]
def get_all_subjects(self) -> List[str]
```

### 2. `data_ingestion.py`

**Key Changes:**

- Added `subject` parameter to all ingestion methods
- Updated `ingest_documents()` to pass subject to RAG service
- Enhanced logging to include subject information

**New Methods:**

```python
def ingest_subject_from_metadata(self, documents: List[Document]) -> Dict[str, bool]
```

### 3. `ai_service.py`

**Key Changes:**

- Updated `is_rag_available()` to check subject-specific availability
- Modified `generate_rag_explanation()` to properly pass subject parameter
- Enhanced RAG query with subject context

## Usage Examples

### Basic Subject Ingestion

```python
from data_ingestion import ingestion_pipeline

# Ingest documents for mathematics
success = ingestion_pipeline.ingest_from_file(
    file_path="math_content.json",
    metadata={"subject": "mathematics", "content_language": "en"},
    subject="mathematics"
)
```

### Subject-Specific RAG Query

```python
from rag_service import rag_service

# Query mathematics knowledge base
response = rag_service.query(
    question="What is algebra?",
    interface_language="en",
    subject="mathematics",
    max_results=4
)
```

### AI-Enhanced Explanations

```python
from ai_service import ai_service

# Generate subject-specific explanation
explanation = await ai_service.generate_rag_explanation(
    question="Solve 2x + 5 = 15",
    options=[{"id": "A", "text": "x = 5"}, {"id": "B", "text": "x = 10"}],
    correct_answer="A",
    subject="mathematics",
    interface_language="en"
)
```

## Collection Naming Convention

| Subject         | Collection Name      |
| --------------- | -------------------- |
| Mathematics     | `artori_mathematics` |
| Physics         | `artori_physics`     |
| Chemistry       | `artori_chemistry`   |
| Biology         | `artori_biology`     |
| General/Default | `artori`             |

## API Changes

### RAGService Methods

- `is_available(subject: str = None) -> bool`
- `add_documents(documents: List[Document], subject: str = None) -> bool`
- `query(..., subject: str = None) -> Dict[str, Any]`
- `get_collection_stats(subject: str = None) -> Dict[str, Any]`
- `get_all_subjects() -> List[str]`

### DataIngestionPipeline Methods

- `ingest_documents(documents: List[Document], subject: str = None) -> bool`
- `ingest_from_file(..., subject: str = None) -> bool`
- `ingest_from_directory(..., subject: str = None) -> bool`
- `ingest_subject_from_metadata(documents: List[Document]) -> Dict[str, bool]`

### AIService Methods

- `is_rag_available(subject: str = None) -> bool`

## Testing the Implementation

### 1. Run the Sample Script

```bash
cd backend
python sample_subject_rag_usage.py
```

### 2. Manual Testing

```python
# Check available subjects
from rag_service import rag_service
subjects = rag_service.get_all_subjects()
print("Available subjects:", subjects)

# Get collection statistics
for subject in subjects:
    stats = rag_service.get_collection_stats(subject)
    print(f"{subject}: {stats}")
```

## Configuration

### Environment Variables

The system uses the same environment variables as before:

- `OPENAI_API_KEY`: For AI explanations
- `CHROMA_API_KEY`: For ChromaDB Cloud (optional)
- `CHROMA_TENANT`: ChromaDB Cloud tenant (optional)
- `CHROMA_DATABASE`: ChromaDB Cloud database (optional)

### Local Development

- Collections are stored in `./chroma_db/` directory
- Each subject gets its own collection within the same database

### Production (ChromaDB Cloud)

- All subject collections are stored in the configured cloud database
- Collections are automatically created as needed

## Benefits

### 1. Improved Accuracy

- Subject-specific knowledge bases reduce noise and improve relevance
- More targeted retrieval leads to better AI explanations

### 2. Scalability

- Easy to add new subjects without affecting existing ones
- Independent scaling of different subject knowledge bases

### 3. Maintainability

- Clear separation of concerns between subjects
- Easier to update or modify subject-specific content

### 4. Performance

- Smaller, focused collections improve query performance
- Reduced search space for better response times

## Migration Notes

### Existing Data

- Existing documents in the default `artori` collection remain accessible
- New subject-specific ingestion will create separate collections
- No data loss or migration required

### Backward Compatibility

- All existing API calls continue to work without modification
- Default behavior (no subject specified) uses the original `artori` collection
- Gradual migration to subject-specific collections is supported

## Future Enhancements

### Potential Improvements

1. **Cross-Subject Queries**: Query multiple subjects simultaneously
2. **Subject Hierarchies**: Support for sub-subjects (e.g., `mathematics_algebra`)
3. **Auto-Subject Detection**: Automatically detect subject from question content
4. **Subject Recommendations**: Suggest related subjects based on query patterns
5. **Collection Management**: Admin interface for managing subject collections

### Performance Optimizations

1. **Collection Caching**: Cache frequently accessed collections
2. **Lazy Loading**: Load collections only when needed
3. **Connection Pooling**: Optimize ChromaDB connections for multiple subjects

## Troubleshooting

### Common Issues

1. **Collection Not Found**

   - Ensure documents have been ingested for the subject
   - Check subject name spelling and formatting

2. **Empty Results**

   - Verify the subject collection contains relevant documents
   - Check if the query language matches the content language

3. **Performance Issues**
   - Monitor collection sizes and consider splitting large subjects
   - Verify ChromaDB connection settings

### Debug Commands

```python
# Check if subject is available
print(rag_service.is_available("mathematics"))

# Get collection statistics
print(rag_service.get_collection_stats("mathematics"))

# List all subjects
print(rag_service.get_all_subjects())
```

## Conclusion

The subject-specific RAG implementation provides a robust foundation for educational content retrieval and AI-enhanced explanations. The system maintains backward compatibility while offering significant improvements in accuracy and organization for subject-specific queries.
