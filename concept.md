Earthquake Survival Quiz Game - Technical Assignment
1. Game Concept
Title: Earthquake Survival Challenge
Genre: Fast-paced quiz/trivia game with time-based decision-making.

Core Mechanics
Players must react within 5 seconds to earthquake scenarios.

Each scenario presents a location, magnitude, and hazards (e.g., collapsing buildings, tsunamis).

Correct answers increase score; wrong answers or timeouts result in "death".

Leaderboard tracks top players globally.

Game Flow
Menu Screen → Start Game / Leaderboard

Nickname Input → Player enters name before playing

Gameplay → 10 randomized scenarios (5 sec each)

Game Over → Score summary + Restart/Menu options

Leaderboard → Top 10 scores fetched from backend

2. Technical Requirements
Frontend (React + Tailwind CSS)
Component	Responsibility
App	Main router (react-router-dom), manages game state (Context API)
Menu	Entry screen (Start Game, View Leaderboard)
NicknameInput	Input field + validation before starting game
Game	Renders scenarios, handles timer (5s countdown), tracks score/lives
GameOver	Displays final score + buttons (Restart / Menu)
Leaderboard	Fetches and displays top 10 scores from backend
Backend (Node.js + Express + MongoDB)
Endpoint	Method	Description
/api/scores	POST	Submits { nickname, score } to database
/api/scores	GET	Retrieves top 10 scores (sorted high→low)
Database Schema:

javascript
Copy
{
  nickname: String,  // Player's chosen name
  score: Number,     // Final score (0–100)
  timestamp: Date    // Auto-generated
}
3. Key Features & Logic
A. Scenario System
Stored as JSON in frontend (example):

javascript
Copy
const scenarios = [
  {
    id: 1,
    location: "Office Building",
    magnitude: 7.2,
    description: "You're on the 12th floor when shaking starts...",
    options: ["Run to elevator", "Hide under desk", "Climb out window"],
    correctAnswer: 1 // Index of correct option
  },
  // ...9 more scenarios
];
Randomized selection (no repeats in one session).

B. Timer & Life System
5-second countdown per question (setInterval).

Failure states:

Wrong answer → "You died!" → Game Over.

Timeout → "Too slow!" → Game Over.

C. Score Calculation
+10 points per correct answer.

Multiplier for consecutive correct answers (e.g., 2x streak).

4. Error Handling & Edge Cases
Case	Solution
Duplicate nicknames	Append random digits (e.g., "Player" → "Player-42")
Backend offline	Fallback to localStorage (scores sync later)
Timer desync	Use useRef + clearInterval to prevent memory leaks
5. Styling Guidelines (Tailwind CSS)
Theming: Dark background (emergency vibe), bold typography.

Responsive: Works on mobile/desktop.

Animations: Shake effects for earthquakes, pulse on timer warning.

Example:

jsx
Copy
<div className="bg-gray-900 text-red-500 animate-pulse">
  <p>Time left: {timeLeft}s</p>
</div>
6. Deployment Plan
Service	Purpose
Vercel	Host React frontend
Railway/Render	Host Node.js backend
NEON PG
7. Acceptance Criteria
✅ Functional:

Nickname input persists across sessions.

Score submission to backend works.

Leaderboard updates in real-time.

✅ Performance:

No lag between questions (scenarios pre-loaded).

Backend responds in <500ms.

✅ UX:

Clear feedback on correct/wrong answers.

Intuitive "Restart" flow.

8. Bonus Features (If Time Permits)
Sound effects (e.g., rumbling, alarms).

Difficulty levels (adjust timer/scenario complexity).

Achievements (e.g., "Survived 5 in a row").