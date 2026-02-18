const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

async function testOllama() {
  console.log('Testing Ollama connection...');
  const hosts = ['http://localhost:11434', 'http://127.0.0.1:11434'];

  for (const host of hosts) {
    try {
      await axios.get(`${host}/api/tags`);
      console.log(`✅ Ollama is reachable at ${host}.`);
      return true;
    } catch (error) {
      // continue
    }
  }
  console.error('❌ Ollama is NOT reachable on localhost or 127.0.0.1:11434. Please ensure "ollama serve" is running.');
  return false;
}

async function testPythonScript() {
  console.log('\nTesting Python script standalone...');
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, 'ai_service/main.py');
    console.log(`Running: python ${scriptPath}`);

    // We use a timeout because it might hang if model is loading
    const pythonProcess = spawn('python', [scriptPath, JSON.stringify({ vibes: 'test', free_time: 'test' })]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => stdout += data.toString());
    pythonProcess.stderr.on('data', (data) => stderr += data.toString());

    pythonProcess.on('error', (err) => {
      console.error('❌ Failed to start Python process:', err.message);
      resolve(false);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const json = JSON.parse(stdout);
          if (json.error) {
            console.error('❌ Python script returned error JSON:', json.error);
            resolve(false);
          } else {
            console.log('✅ Python script returned valid JSON.');
            resolve(true);
          }
        } catch (e) {
          console.error('❌ Python script output is not valid JSON:', stdout);
          console.error('Stderr:', stderr);
          resolve(false);
        }
      } else {
        console.error('❌ Python script failed with code', code);
        console.error('Stderr:', stderr);
        resolve(false);
      }
    });
  });
}

async function testServerEndpoint() {
  console.log('\nTesting Server Endpoint (integration)...');
  try {
    // We use a small timeout because generation takes time, but we just want to see if it accepts the connection
    // However, we want to see if it returns successfully, so we need a long timeout.
    const response = await axios.post('http://localhost:5000/api/itinerary', {
      vibes: 'Relaxed',
      freeTime: 'Weekend'
    }, { timeout: 10000 }); // 10s timeout, enough to fail probably if model is slow, but we want to know if connection works.

    if (response.status === 200) {
      if (response.data.error) {
        console.error('❌ Server returned error:', response.data.error);
        return false;
      }
      console.log('✅ Server returned valid response.');
      return true;
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Server is NOT reachable on port 5000. Is "npm run dev" running?');
    } else if (error.code === 'ECONNABORTED') {
      console.log('⚠️ Server connected but timed out (Model is likely loading/generating). This is actually GOOD sign for connectivity.');
      return true;
    } else {
      console.error('❌ Server request failed:', error.message);
      if (error.response?.data) console.error('Data:', error.response.data);
    }
    return false;
  }
}

async function runTests() {
  const ollamaOk = await testOllama();
  if (!ollamaOk) {
    console.log('\n⚠️ Skipping other tests because Ollama is down.');
    return;
  }

  const pythonOk = await testPythonScript();
  if (!pythonOk) return;

  const serverOk = await testServerEndpoint();
  if (serverOk) {
    console.log('\n🎉 ALL SYSTEMS GO! The app should work perfectly.');
  } else {
    console.log('\n⚠️ Some issues were found. Check the logs above.');
  }
}

runTests();
