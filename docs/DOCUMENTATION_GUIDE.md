# Documentation Management Guide

This guide explains how to maintain and update documentation for the Upreak website project.

## Documentation Structure

```
docs/
├── PROJECT_OVERVIEW.md       # Complete project documentation
├── API_DOCUMENTATION.md       # API endpoints documentation
├── CHANGELOG.md               # Change log for all changes
└── update-docs.sh            # Documentation update script
```

## When to Update Documentation

Documentation should be updated whenever:

### 1. Code Changes
- **New API Endpoints**: Add to API_DOCUMENTATION.md
- **Modified APIs**: Update API_DOCUMENTATION.md
- **New Pages**: Update PROJECT_OVERVIEW.md
- **Database Changes**: Update PROJECT_OVERVIEW.md and API_DOCUMENTATION.md
- **New Components**: Update PROJECT_OVERVIEW.md

### 2. Feature Changes
- **New Features**: Add to PROJECT_OVERVIEW.md and CHANGELOG.md
- **Modified Features**: Update PROJECT_OVERVIEW.md
- **Deprecated Features**: Update PROJECT_OVERVIEW.md and CHANGELOG.md

### 3. Configuration Changes
- **Environment Variables**: Update PROJECT_OVERVIEW.md
- **Database Schema**: Update PROJECT_OVERVIEW.md and API_DOCUMENTATION.md
- **Dependencies**: Update PROJECT_OVERVIEW.md

## Documentation Update Process

### Step 1: Identify Changes
Before making changes, identify what needs to be documented:

```bash
# Check what files you're modifying
git status
git diff --name-only
```

### Step 2: Update Relevant Documentation

#### For API Changes
Update `docs/API_DOCUMENTATION.md`:
- Add new endpoint documentation
- Update existing endpoint documentation
- Update request/response examples
- Update error handling documentation

#### For Feature Changes
Update `docs/PROJECT_OVERVIEW.md`:
- Add new feature descriptions
- Update existing feature documentation
- Update architecture diagrams
- Update deployment instructions

#### For Database Changes
Update both documentation files:
- `docs/PROJECT_OVERVIEW.md`: Update database schema section
- `docs/API_DOCUMENTATION.md`: Update related API endpoints

### Step 3: Update Change Log
Update `docs/CHANGELOG.md`:
- Add new entry under appropriate version
- Follow the format: [Added/Changed/Fixed/Deprecated/Removed/Security]
- Include impact assessment
- Include migration guide if needed

### Step 4: Validate Documentation
Run the validation checks:

```bash
# Check if all required files exist
ls -la docs/

# Check if files are not empty
wc -l docs/*.md

# Check for broken links (if any)
# This would require additional tools like markdown-link-check
```

## Documentation Templates

### API Endpoint Template
```markdown
### POST /api/endpoint/name

**Endpoint**: `POST /api/endpoint/name`

**Description**: Brief description of what the endpoint does

**Request Body**:
```json
{
  "field1": "string",
  "field2": "number"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "data": {}
}
```

**Response** (Error - 400):
```json
{
  "error": "Error message"
}
```

**Example Usage**:
```javascript
const response = await fetch('/api/endpoint/name', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    field1: 'value',
    field2: 123
  }),
});
```
```

### Change Log Entry Template
```markdown
### Added
- **New Feature Name**
  - Description of what was added
  - Impact: High/Medium/Low
  - Files Changed: file1.ts, file2.ts
  - Date: YYYY-MM-DD

### Changed
- **Modified Feature**
  - Description of what was changed
  - Impact: High/Medium/Low
  - Files Changed: file1.ts, file2.ts
  - Date: YYYY-MM-DD

### Fixed
- **Bug Fix**
  - Description of what was fixed
  - Files Changed: file1.ts
  - Date: YYYY-MM-DD
```

## Automated Documentation Updates

### Using the Update Script
The project includes a script to help with documentation updates:

```bash
# Show help
./docs/update-docs.sh help

# Update documentation for new changes
./docs/update-docs.sh update "Added" "New login endpoint" "src/app/api/auth/login.ts" "High"

# Check if documentation needs updates
./docs/update-docs.sh check "src/app/api/users/route.ts"

# Validate documentation
./docs/update-docs.sh validate

# Show documentation status
./docs/update-docs.sh status
```

### Git Hooks (Recommended)
Set up Git hooks to automatically check documentation:

```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Check if documentation needs updates
files_changed=$(git diff --cached --name-only)
if ./docs/update-docs.sh check "$files_changed"; then
    echo "⚠️  Documentation may need updates"
    echo "Please run: ./docs/update-docs.sh update"
    exit 1
fi

exit 0
EOF

chmod +x .git/hooks/pre-commit
```

## Documentation Best Practices

### 1. Keep it Current
- Update documentation before or immediately after code changes
- Never commit code without updating related documentation
- Review documentation during code reviews

### 2. Be Comprehensive
- Include all necessary details for each feature
- Provide examples for API endpoints
- Document error cases and edge cases

### 3. Be Consistent
- Follow the established format and structure
- Use consistent terminology
- Maintain consistent formatting

### 4. Be Accessible
- Write for different audiences (developers, admins, users)
- Include both technical and non-technical explanations
- Provide clear examples and use cases

### 5. Be Versioned
- Use semantic versioning for documentation
- Maintain change log for all changes
- Document breaking changes clearly

## Documentation Review Process

### 1. Self-Review
- Read through your documentation changes
- Test all examples and code snippets
- Check for consistency and completeness

### 2. Peer Review
- Have team members review documentation
- Check for clarity and accuracy
- Verify technical details

### 3. User Testing
- Test documentation with actual users
- Gather feedback on clarity and usefulness
- Update based on user feedback

## Common Documentation Mistakes to Avoid

### 1. Outdated Information
- Always update documentation when code changes
- Remove deprecated information
- Keep examples current

### 2. Missing Information
- Document all parameters and return values
- Include error cases and edge cases
- Document configuration requirements

### 3. Inconsistent Formatting
- Follow established templates
- Use consistent code formatting
- Maintain consistent structure

### 4. Lack of Examples
- Provide practical examples
- Include common use cases
- Show error handling examples

### 5. Poor Organization
- Use clear headings and structure
- Include table of contents for long documents
- Group related information together

## Tools and Resources

### Documentation Tools
- **Markdown**: Primary documentation format
- **Diagrams**: Use Mermaid or PlantUML for architecture diagrams
- **API Documentation**: Consider Swagger/OpenAPI for API docs
- **Screenshots**: Include screenshots for UI documentation

### Validation Tools
- **markdownlint**: Lint Markdown files
- **markdown-link-check**: Check for broken links
- **spellcheck**: Check spelling in documentation

### Automation Tools
- **Git Hooks**: Automate documentation checks
- **CI/CD**: Include documentation validation in builds
- **Scripts**: Use the provided update script

## Documentation Maintenance Schedule

### Daily
- Update documentation for daily changes
- Check for broken links or outdated information

### Weekly
- Review documentation for consistency
- Update change log with weekly changes
- Check documentation coverage

### Monthly
- Comprehensive documentation review
- Update screenshots and diagrams
- Check for deprecated features

### Quarterly
- Major documentation overhaul
- Restructure if needed
- Update templates and guidelines

## Emergency Documentation Updates

For critical bugs or security issues:

1. **Update Documentation Immediately**
   - Document the fix
   - Update change log
   - Communicate changes to team

2. **Communicate Changes**
   - Notify team of documentation updates
   - Highlight critical changes
   - Provide migration guidance

3. **Review and Validate**
   - Ensure accuracy of emergency updates
   - Test all examples and procedures
   - Get peer review if time permits

## Getting Help

### Documentation Issues
- Create an issue in the project repository
- Tag with "documentation" label
- Provide details about what needs improvement

### Questions
- Contact the development team
- Check existing documentation first
- Provide context for your question

### Contributions
- Follow the contribution guidelines
- Include documentation updates with code changes
- Review documentation guidelines before contributing

---

*Last Updated: January 15, 2024*
*Version: 1.0.0*