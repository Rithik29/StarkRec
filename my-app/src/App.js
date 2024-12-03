



// import React, { useState, useEffect } from 'react';
// import { TrendingUp, Zap, Shield, Octagon, Pause, MousePointerClick } from 'lucide-react';
// import './App.css';

// const App = () => {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [probabilities, setProbabilities] = useState([]);
//   const [isStarted, setIsStarted] = useState(false);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [intervalId, setIntervalId] = useState(null);

//   // Fetch questions and probabilities from Flask server
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:5000/api/questions');
//         const data = await response.json();
//         setQuestions(data);
//         setAnswers(new Array(data.length).fill(null));
//       } catch (error) {
//         console.error('Error fetching questions:', error);
//       }
//     };

//     const fetchProbabilities = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:5000/api/predictions');
//         const data = await response.json();
//         setProbabilities(data.map(prob => parseFloat(prob))); // Parse to float
//       } catch (error) {
//         console.error('Error fetching probabilities:', error);
//       }
//     };

//     fetchQuestions();
//     fetchProbabilities();
//   }, []);

//   const handleAnswer = (index, answer) => {
//     const newAnswers = [...answers];
//     newAnswers[index] = answer;
//     setAnswers(newAnswers);

//     setSelectedAnswers(prev => ({
//       ...prev,
//       [index]: answer
//     }));
//   };


//   const handleStart = () => {
//     setIsStarted(true);
  
//     const id = setInterval(() => {
//       setProbabilities(prevProbs => 
//         prevProbs.map(prob => {
//           // Randomly decide to add or subtract
//           const isAddition = Math.random() > 0.5; // 50% chance to add or subtract
//           const change = Math.random() * 0.1; // Random change between 0 and 0.1 (10%)
  
//           let newProb = isAddition 
//             ? prob + change  // Add change
//             : prob - change; // Subtract change
  
//           // Ensure the probability stays between 0 and 1
//           return Math.max(0, Math.min(1, newProb));
//         })
//       );
//     }, 5000);
  
//     setIntervalId(id);
//   };
  
//   const handleStop = () => {
//     if (intervalId) {
//       clearInterval(intervalId);
//       setIntervalId(null);
//       setIsStarted(false);
//     }
//   };

//   const handleAutoSelect = () => {
//     const newSelectedAnswers = {};
//     probabilities.forEach((prob, index) => {
//       // If probability is above 0.5, select 'Yes', otherwise 'No'
//       newSelectedAnswers[index] = prob > 0.5;
//     });
    
//     setSelectedAnswers(newSelectedAnswers);
//   };

//   return (
//     <div className="app-container">
//       <div className="hero-section">
//         <div className="hero-background"></div>
//         <div className="hero-content">
//           <h1>StarkRec</h1>
//           <p>AI Agents for Autonomous Market Creation and Prediction</p>
          
//           <div className="button-group">
//             {!isStarted && (
//               <button className="start-btn" onClick={handleStart}>
//                 <TrendingUp size={18} /> Start Market
//               </button>
//             )}
//             {isStarted && (
//               <button className="stop-btn" onClick={handleStop}>
//                 <Pause size={18} /> Stop Market Update
//               </button>
//             )}
//             <button className="auto-select-btn" onClick={handleAutoSelect}>
//               <MousePointerClick size={18} /> Auto Bet
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="predictions-container">
//         {questions.length > 0 && probabilities.length > 0 ? (
//           questions.map((question, index) => (
//             <div key={index} className="prediction-card">
//               <h3>Prediction {index + 1}</h3>
//               <p>{question}</p>
              
//               <div className="answer-buttons">
//                 <button 
//                   onClick={() => handleAnswer(index, true)}
//                   className={`yes-btn ${selectedAnswers[index] === true ? 'selected' : ''}`}
//                 >
//                   Yes
//                 </button>
//                 <button 
//                   onClick={() => handleAnswer(index, false)}
//                   className={`no-btn ${selectedAnswers[index] === false ? 'selected' : ''}`}
//                 >
//                   No
//                 </button>
//               </div>
              
//               <div className="probability-bar">
//                 <div 
//                   className="probability-fill" 
//                   style={{
//                     width: `${probabilities[index] * 100}%`,
//                     backgroundColor: probabilities[index] > 0.5 ? '#2ecc71' : '#e74c3c'
//                   }}
//                 >
//                   {(probabilities[index] * 100).toFixed(1)}%
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="loading">Loading predictions...</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, Shield, Octagon, Pause, MousePointerClick, RefreshCcw } from 'lucide-react';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [probabilities, setProbabilities] = useState([]);
  const [marketStatus, setMarketStatus] = useState('initial');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [intervalId, setIntervalId] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [marketConclusion, setMarketConclusion] = useState(null);

  const fetchMarketData = async () => {
    try {
      setMarketStatus('creating');
      setCurrentPhase(0);
      setSelectedAnswers({});
      setMarketConclusion(null);

      // Simulate loading time in hero section
      await new Promise(resolve => setTimeout(resolve, 3000));

      const questionsResponse = await fetch('http://127.0.0.1:5000/api/questions');
      const questionsData = await questionsResponse.json();
      setQuestions(questionsData);
      setAnswers(new Array(questionsData.length).fill(null));

      const probabilitiesResponse = await fetch('http://127.0.0.1:5000/api/predictions');
      const probabilitiesData = await probabilitiesResponse.json();
      setProbabilities(probabilitiesData.map(prob => parseFloat(prob)));

      startMarketUpdates();
    } catch (error) {
      console.error('Error fetching market data:', error);
      setMarketStatus('initial');
    }
  };

  const startMarketUpdates = () => {
    setMarketStatus('active');
    setCurrentPhase(1);
    setIsStarted(true);

    const id = setInterval(() => {
      setProbabilities(prevProbs => 
        prevProbs.map(prob => {
          const isAddition = Math.random() > 0.5;
          const change = Math.random() * 0.1;

          let newProb = isAddition 
            ? prob + change
            : prob - change;

          return Math.max(0, Math.min(1, newProb));
        })
      );

      // Update phase
      setCurrentPhase(prevPhase => {
        const nextPhase = prevPhase + 1;
        if (nextPhase > 4) {
          clearInterval(id);
          setMarketStatus('concluded');
          setIsStarted(false);
          setMarketConclusion({
            message: "Market Trading Concluded",
            subMessage: "Market will be resolved shortly"
          });
          return 4;
        }
        return nextPhase;
      });
    }, 10000);

    setIntervalId(id);
  };

  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsStarted(false);
    }
  };

  const handleCreateMarket = () => {
    fetchMarketData();
  };

  const handleAnswer = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);

    setSelectedAnswers(prev => ({
      ...prev,
      [index]: answer
    }));
  };

  const handleAutoSelect = () => {
    const newSelectedAnswers = {};
    probabilities.forEach((prob, index) => {
      // If probability is above 0.5, select 'Yes', otherwise 'No'
      newSelectedAnswers[index] = prob > 0.5;
      
      // Stop market updates if not already concluded
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
        setIsStarted(false);
      }
    });
    
    setSelectedAnswers(newSelectedAnswers);
  };

  const renderHeroSection = () => {
    const isLargeHero = marketStatus === 'initial';
    
    return (
      <div className={`hero-section ${isLargeHero ? 'large-hero' : ''}`}>
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1>StarkRec</h1>
          <p>AI Agents for Autonomous Market Creation and Prediction</p>
          <p>Use Create Market button to create a new market for football events to happen</p>
          
          <div className="button-group">
            {marketStatus === 'initial' && (
              <button className="create-market-btn" onClick={handleCreateMarket}>
                <TrendingUp size={18} /> Create Market
              </button>
            )}
            
            {marketStatus === 'creating' && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Creating Market...</p>
              </div>
            )}
            
            {(marketStatus === 'active' || marketStatus === 'concluded') && (
              <>
                {isStarted && (
                  <button className="stop-btn" onClick={handleStop}>
                    <Pause size={18} /> Stop Market Update
                  </button>
                )}
                <button className="auto-select-btn" onClick={handleAutoSelect}>
                  <MousePointerClick size={18} /> Auto Bet
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {renderHeroSection()}

      {(marketStatus === 'active' || marketStatus === 'concluded') && (
        <div className="market-container">
          <div className="market-header">
            <h2>Market Phase: {currentPhase}</h2>
            {marketStatus === 'concluded' && marketConclusion && (
              <div className="market-conclusion">
                <h3>{marketConclusion.message}</h3>
                <p>{marketConclusion.subMessage}</p>
              </div>
            )}
          </div>

          <div className="predictions-container">
            {questions.map((question, index) => (
              <div key={index} className="prediction-card">
                <h3>Prediction {index + 1}</h3>
                <p>{question}</p>
                
                <div className="answer-buttons">
                  <button 
                    onClick={() => handleAnswer(index, true)}
                    className={`yes-btn ${selectedAnswers[index] === true ? 'selected' : ''}`}
                    disabled={marketStatus === 'concluded'}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => handleAnswer(index, false)}
                    className={`no-btn ${selectedAnswers[index] === false ? 'selected' : ''}`}
                    disabled={marketStatus === 'concluded'}
                  >
                    No
                  </button>
                </div>
                
                <div className="probability-bar">
                  <div 
                    className="probability-fill" 
                    style={{
                      width: `${probabilities[index] * 100}%`,
                      backgroundColor: probabilities[index] > 0.5 ? '#2ecc71' : '#e74c3c'
                    }}
                  >
                    {(probabilities[index] * 100).toFixed(1)}%
                  </div>
                </div>

                {marketStatus === 'concluded' && selectedAnswers[index] !== undefined && (
                  <div className="bet-result">
                    <p>You bet: {selectedAnswers[index] ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {marketStatus === 'concluded' && (
            <div className="market-restart">
              <button className="create-market-btn" onClick={handleCreateMarket}>
                <RefreshCcw size={18} /> Create New Market
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;