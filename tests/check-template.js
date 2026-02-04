const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

const checkTemplate = (templateName) => {
  // const templatePath = path.join(__dirname, 'templates', templateName);
  const templatePath = "/home/kingofprograming/Desktop/Tests/RealEstateProject/github/real-estate/templates/agreement-template.docx"
  
  console.log(`\n=== Checking template: ${templateName} ===`);
  console.log('Path:', templatePath);
  
  if (!fs.existsSync(templatePath)) {
    console.log('❌ Template file not found');
    return;
  }
  
  try {
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    
    // Extract and check the XML
    const xml = zip.files['word/document.xml'].asText();
    console.log('✅ Template loaded successfully');
    
    // Find all template tags
    console.log('\nLooking for template tags...');
    
    // Method 1: Look for double curly braces
    const doubleBraceRegex = /{{[^}]*}}/g;
    const doubleMatches = xml.match(doubleBraceRegex);
    console.log('Complete {{ }} tags found:', doubleMatches || 'None');
    
    // Method 2: Look for opening tags without closing
    const openingTags = xml.match(/{{[^}]*$/g);
    if (openingTags) {
      console.log('⚠️  Incomplete opening tags found:', openingTags);
    }
    
    // Method 3: Look for closing tags without opening
    const closingTags = xml.match(/[^{]*}}/g);
    if (closingTags) {
      console.log('⚠️  Incomplete closing tags found:', closingTags);
    }
    
    // Method 4: Search for problematic patterns
    console.log('\nSearching for specific patterns...');
    if (xml.includes('{{clie')) {
      console.log('❌ Found incomplete tag: "{{clie"');
      console.log('Context around it:', xml.substring(
        xml.indexOf('{{clie') - 50,
        xml.indexOf('{{clie') + 100
      ));
    }
    
    if (xml.includes('name}}')) {
      console.log('❌ Found incomplete tag: "name}}"');
      console.log('Context around it:', xml.substring(
        xml.indexOf('name}}') - 50,
        xml.indexOf('name}}') + 100
      ));
    }
    
  } catch (error) {
    console.error('Error checking template:', error.message);
  }
};

// Check both templates
checkTemplate('agreement-template.docx');
// checkTemplate('test-template.docx');
