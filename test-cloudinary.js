// Test Cloudinary upload using fetch
async function testCloudinaryUpload() {
  try {
    // First register a user
    console.log('Registering test user...');
    const registerResponse = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Architect',
        email: 'test@architect.com',
        password: 'password123',
        role: 'architect'
      })
    });
    const registerData = await registerResponse.json();
    console.log('Registration successful:', registerData);

    // Login to get token
    console.log('Logging in...');
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@architect.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData);

    const token = loginData.token;

    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

    // Create FormData
    const formData = new FormData();
    formData.append('image', new Blob([testImageBuffer], { type: 'image/png' }), 'test-image.png');

    // Upload image
    console.log('Uploading image to Cloudinary...');
    const uploadResponse = await fetch('http://localhost:5001/api/architects/upload-image', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const uploadData = await uploadResponse.json();
    console.log('Upload successful!');
    console.log('Response:', uploadData);

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testCloudinaryUpload();
