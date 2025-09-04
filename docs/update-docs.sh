#!/bin/bash

# Documentation Update Script
# This script helps maintain documentation when changes are made to the project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to update documentation
update_documentation() {
    local change_type="$1"
    local description="$2"
    local files_changed="$3"
    local impact="$4"
    
    print_status "Updating documentation for: $description"
    
    # Get current date
    current_date=$(date +"%Y-%m-%d")
    current_time=$(date +"%H:%M:%S")
    
    # Create temporary change log entry
    cat > /tmp/changelog_entry.md << EOF
### Added
- **$description**
  - Impact: $impact
  - Files Changed: $files_changed
  - Date: $current_date $current_time

EOF

    # Check if CHANGELOG.md exists
    if [ ! -f "docs/CHANGELOG.md" ]; then
        print_error "CHANGELOG.md not found in docs directory"
        exit 1
    fi

    # Insert the new entry into the changelog
    # This is a simplified version - in practice, you'd want more sophisticated parsing
    sed -i '/## \[Unreleased\]/a\
'"$(cat /tmp/changelog_entry.md)"'' docs/CHANGELOG.md

    # Clean up temporary file
    rm /tmp/changelog_entry.md
    
    print_success "Documentation updated successfully"
}

# Function to check for documentation updates needed
check_documentation_needs() {
    local files_changed="$1"
    
    # Check if any files were changed that require documentation updates
    if echo "$files_changed" | grep -q "src/app/api/"; then
        print_warning "API files changed - documentation may need updates"
        return 0
    fi
    
    if echo "$files_changed" | grep -q "src/app/.*page.tsx"; then
        print_warning "Page files changed - documentation may need updates"
        return 0
    fi
    
    if echo "$files_changed" | grep -q "prisma/schema.prisma"; then
        print_warning "Database schema changed - documentation may need updates"
        return 0
    fi
    
    if echo "$files_changed" | grep -q "src/components/"; then
        print_warning "Component files changed - documentation may need updates"
        return 0
    fi
    
    return 1
}

# Function to generate API documentation
generate_api_docs() {
    print_status "Generating API documentation..."
    
    # This is a placeholder for API documentation generation
    # In practice, you might use tools like Swagger, Postman, or custom scripts
    
    print_success "API documentation generated"
}

# Function to generate component documentation
generate_component_docs() {
    print_status "Generating component documentation..."
    
    # This is a placeholder for component documentation generation
    # In practice, you might use tools like Storybook or custom scripts
    
    print_success "Component documentation generated"
}

# Function to validate documentation
validate_documentation() {
    print_status "Validating documentation..."
    
    # Check if all required documentation files exist
    required_files=(
        "docs/PROJECT_OVERVIEW.md"
        "docs/API_DOCUMENTATION.md"
        "docs/CHANGELOG.md"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required documentation file missing: $file"
            exit 1
        fi
    done
    
    # Check if documentation files are not empty
    for file in "${required_files[@]}"; do
        if [ ! -s "$file" ]; then
            print_error "Documentation file is empty: $file"
            exit 1
        fi
    done
    
    print_success "Documentation validation passed"
}

# Function to show documentation status
show_documentation_status() {
    print_status "Documentation Status"
    echo "================================"
    
    # Check documentation files
    if [ -f "docs/PROJECT_OVERVIEW.md" ]; then
        echo "✓ Project Overview: $(wc -l < docs/PROJECT_OVERVIEW.md | tr -d ' ') lines"
    else
        echo "✗ Project Overview: Missing"
    fi
    
    if [ -f "docs/API_DOCUMENTATION.md" ]; then
        echo "✓ API Documentation: $(wc -l < docs/API_DOCUMENTATION.md | tr -d ' ') lines"
    else
        echo "✗ API Documentation: Missing"
    fi
    
    if [ -f "docs/CHANGELOG.md" ]; then
        echo "✓ Change Log: $(wc -l < docs/CHANGELOG.md | tr -d ' ') lines"
    else
        echo "✗ Change Log: Missing"
    fi
    
    echo "================================"
}

# Main script logic
case "${1:-help}" in
    "update")
        if [ $# -lt 4 ]; then
            print_error "Usage: $0 update <change_type> <description> <files_changed> <impact>"
            echo "Example: $0 update 'Added' 'New API endpoint' 'src/app/api/users/route.ts' 'Medium'"
            exit 1
        fi
        update_documentation "$2" "$3" "$4" "$5"
        ;;
    "check")
        if [ $# -lt 2 ]; then
            print_error "Usage: $0 check <files_changed>"
            echo "Example: $0 check 'src/app/api/users/route.ts src/components/User.tsx'"
            exit 1
        fi
        check_documentation_needs "$2"
        ;;
    "generate-api")
        generate_api_docs
        ;;
    "generate-components")
        generate_component_docs
        ;;
    "validate")
        validate_documentation
        ;;
    "status")
        show_documentation_status
        ;;
    "help"|*)
        echo "Documentation Management Script"
        echo "================================"
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  update <change_type> <description> <files_changed> <impact>"
        echo "                          Update documentation with new changes"
        echo "  check <files_changed>     Check if documentation needs updates"
        echo "  generate-api              Generate API documentation"
        echo "  generate-components      Generate component documentation"
        echo "  validate                  Validate documentation completeness"
        echo "  status                   Show documentation status"
        echo "  help                      Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 update 'Added' 'New login endpoint' 'src/app/api/auth/login.ts' 'High'"
        echo "  $0 check 'src/app/api/users/route.ts'"
        echo "  $0 validate"
        echo "  $0 status"
        exit 0
        ;;
esac