const fs = require('fs');
const { compile } = require('@mdx-js/mdx');

async function testMDX() {
    try {
        const content = fs.readFileSync('content/informatics/grade-12/bai-7.mdx', 'utf8');
        await compile(content, { jsx: true });
        console.log('✅ MDX COMPILED SUCCESSFULLY!');
    } catch (error) {
        console.log('❌ MDX COMPILATION ERROR:');
        console.log(error.message);
        if (error.position) {
            console.log(`Line: ${error.position.start.line}, Column: ${error.position.start.column}`);
        }
    }
}

testMDX();
