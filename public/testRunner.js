document.getElementById('run-tests').addEventListener('click', runTests);

async function runTests() {
    const testResults = document.getElementById('test-results');
    testResults.innerHTML = 'Running tests...';

    try {
        const response = await fetch('/run-tests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const results = await response.json();
            displayResults(results);
        } else {
            testResults.innerHTML = 'Failed to run tests';
        }
    } catch (error) {
        testResults.innerHTML = `Error: ${error.message}`;
    }
}

function displayResults(results) {
    const testResults = document.getElementById('test-results');
    testResults.innerHTML = '';

    results.forEach(test => {
        const testDiv = document.createElement('div');
        testDiv.className = test.status === 'passed' ? 'test-pass' : 'test-fail';
        testDiv.textContent = `${test.name}: ${test.status}`;
        testResults.appendChild(testDiv);
    });
}
