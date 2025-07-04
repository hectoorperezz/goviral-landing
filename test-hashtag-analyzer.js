// Test Script for GoViral Hashtag Analyzer - Simplified Version (No Database)
// Tests the simplified service that works purely with API calls

const API_BASE_URL = 'http://localhost:3000/api';

console.log('🧪 GoViral Hashtag Analyzer Test Suite - SIMPLIFIED VERSION');
console.log('================================================');
console.log('✅ NO DATABASE REQUIRED - Pure API Service');
console.log('');

async function runTests() {
  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Environment Check
  console.log('🔧 Test 1: Environment Variables Check');
  totalTests++;
  try {
    const response = await fetch(`${API_BASE_URL}/hashtag-analyzer/analyze`);
    const data = await response.json();
    
    if (data.message && data.message.includes('Simplified Version')) {
      console.log('✅ API endpoint responding correctly');
      console.log(`   Description: ${data.description}`);
      console.log(`   Required vars: ${data.requiredEnvVars.join(', ')}`);
      passedTests++;
    } else {
      console.log('❌ API endpoint not responding correctly');
    }
  } catch (error) {
    console.log('❌ Failed to connect to API endpoint');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');

  // Test 2: Hashtag Analysis (Fitness Content)
  console.log('🏋️ Test 2: Fitness Content Analysis');
  totalTests++;
  const fitnessContext = {
    contentType: 'Video de rutina de ejercicios',
    targetAudience: 'Personas de 25-35 años interesadas en fitness',
    contentDescription: 'Rutina de ejercicios de 30 minutos para hacer en casa sin equipo. Incluye cardio y tonificación muscular.',
    goal: 'engagement',
    industry: 'fitness'
  };

  try {
    console.log('🚀 Sending analysis request...');
    const startTime = Date.now();
    
    const response = await fetch(`${API_BASE_URL}/hashtag-analyzer/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fitnessContext),
    });

    const responseTime = Date.now() - startTime;
    console.log(`⏱️  Response time: ${responseTime}ms`);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ API request failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${errorData.error}`);
      console.log(`   Details: ${errorData.details}`);
    } else {
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('✅ Hashtag analysis successful');
        
        const result = data.data;
        console.log(`   Generated hashtags: ${result.generatedHashtags.length}`);
        console.log(`   Analyzed hashtags: ${result.analyzedHashtags.length}`);
        console.log(`   Success probability: ${result.strategicRecommendations.successProbability}%`);
        
        // Validate data structure
        if (result.generatedHashtags && result.analyzedHashtags && 
            result.recommendedMix && result.strategicRecommendations) {
          console.log('✅ Data structure validation passed');
          
          // Display sample results
          console.log('\n📊 Sample Results:');
          console.log(`   Strategy: ${result.strategicRecommendations.mixStrategy}`);
          console.log(`   Expected reach: ${result.strategicRecommendations.expectedReachMin} - ${result.strategicRecommendations.expectedReachMax}`);
          
          if (result.recommendedMix.broad.length > 0) {
            console.log(`   Broad hashtags: #${result.recommendedMix.broad.slice(0, 3).join(', #')}`);
          }
          
          if (result.analyzedHashtags.length > 0) {
            const sample = result.analyzedHashtags[0];
            console.log(`   Sample analysis: #${sample.hashtag} (${sample.formattedCount} posts, ${sample.difficultyScore}/100 difficulty)`);
          }
          
          passedTests++;
        } else {
          console.log('❌ Data structure validation failed');
          console.log('   Missing required fields in response');
        }
      } else {
        console.log('❌ API response indicates failure');
        console.log(`   Data: ${JSON.stringify(data, null, 2)}`);
      }
    }
  } catch (error) {
    console.log('❌ Request failed');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');

  // Test 3: Input Validation
  console.log('🔒 Test 3: Input Validation');
  totalTests++;
  
  const invalidContext = {
    contentType: '', // Invalid: empty
    targetAudience: 'Test audience',
    contentDescription: 'Short' // Invalid: too short
  };

  try {
    const response = await fetch(`${API_BASE_URL}/hashtag-analyzer/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidContext),
    });

    if (response.status === 400) {
      const errorData = await response.json();
      console.log('✅ Input validation working correctly');
      console.log(`   Error message: ${errorData.details}`);
      passedTests++;
    } else {
      console.log('❌ Input validation not working correctly');
      console.log(`   Expected 400 status, got ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Validation test failed');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');

  // Test 4: Performance Check
  console.log('⚡ Test 4: Performance Test');
  totalTests++;
  
  const performanceContext = {
    contentType: 'Post de receta saludable',
    targetAudience: 'Amantes de la comida saludable',
    contentDescription: 'Receta fácil y rápida de ensalada mediterránea con ingredientes frescos y nutritivos.',
    goal: 'awareness',
    industry: 'food'
  };

  try {
    const startTime = Date.now();
    
    const response = await fetch(`${API_BASE_URL}/hashtag-analyzer/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(performanceContext),
    });

    const responseTime = Date.now() - startTime;
    console.log(`⏱️  Performance test response time: ${responseTime}ms`);

    if (responseTime < 30000) { // 30 seconds for no-cache version
      console.log('✅ Performance test passed (under 30 seconds)');
      passedTests++;
    } else {
      console.log('❌ Performance test failed (over 30 seconds)');
    }

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        console.log('✅ Performance test also functionally successful');
      }
    }
  } catch (error) {
    console.log('❌ Performance test failed');
    console.log(`   Error: ${error.message}`);
  }
  console.log('');

  // Summary
  console.log('================================================');
  console.log('📋 TEST SUMMARY');
  console.log('================================================');
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Hashtag Analyzer is ready for production');
    console.log('');
    console.log('🚀 NO DATABASE SETUP REQUIRED');
    console.log('💰 Pure API service - no storage costs');
    console.log('🔄 Always fresh data - no cache staleness');
    console.log('⚡ Simple architecture - easier to maintain');
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
    console.log('');
    console.log('🔧 Required environment variables:');
    console.log('   - OPENAI_API_KEY');
    console.log('   - RAPIDAPI_KEY');
  }
  
  console.log('');
  console.log('================================================');
}

// Run the tests
runTests().catch(console.error); 