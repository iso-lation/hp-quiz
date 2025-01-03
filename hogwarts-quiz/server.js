const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Set up session middleware
app.use(session({
    secret: 'secret_key', 
    resave: false, 
    saveUninitialized: true
}));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Set up public 
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse POST request data
app.use(express.urlencoded({ extended: true }));

// Store user's answers
let userAnswers = {
    Gryffindor: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
    Slytherin: 0
};

// Define questions
const questions = [
    // Existing questions here...

    { 
        id: 1, 
        question: 'You find a classmate struggling with a spell, what do you do?', 
        answers: [
            { text: 'Offer to teach them the spell yourself', house: 'Hufflepuff', score: 1 },
            { text: 'Challenge them to figure it out themselves', house: 'Slytherin', score: 1 },
            { text: 'Encourage them with kind words and share your experience', house: 'Gryffindor', score: 1 },
            { text: 'Recommend a book or technique to help them', house: 'Ravenclaw', score: 1 }
        ]
    },
    { 
        id: 2, 
        question: 'You’re in a duel, what’s your strategy?', 
        answers: [
            { text: 'Focus on disarming your opponent', house: 'Gryffindor', score: 1 },
            { text: 'Use clever and unexpected spells', house: 'Ravenclaw', score: 1 },
            { text: 'Go for a quick and decisive win', house: 'Slytherin', score: 1 },
            { text: 'Defend yourself and only retaliate if necessary', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 3, 
        question: 'You find a secret passage in Hogwarts, what do you do?', 
        answers: [
            { text: 'Explore it right away, no hesitation', house: 'Gryffindor', score: 1 },
            { text: 'Map it out and figure out where it leads', house: 'Ravenclaw', score: 1 },
            { text: 'Use it to your advantage when needed', house: 'Slytherin', score: 1 },
            { text: 'Inform a professor about your discovery', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 4, 
        question: 'A magical creature is injured in the forest, what do you do?', 
        answers: [
            { text: 'Help it heal and ensure it’s safe', house: 'Hufflepuff', score: 1 },
            { text: 'Analyze the creature and learn about its habits', house: 'Ravenclaw', score: 1 },
            { text: 'Try to tame it and use it for assistance', house: 'Slytherin', score: 1 },
            { text: 'Defend it from any threats and protect it', house: 'Gryffindor', score: 1 }
        ]
    },
    { 
        id: 5, 
        question: 'How would you prepare for a big exam at Hogwarts?', 
        answers: [
            { text: 'Study all night with detailed notes', house: 'Ravenclaw', score: 1 },
            { text: 'Rely on your instincts and past knowledge', house: 'Gryffindor', score: 1 },
            { text: 'Use creative shortcuts and focus on what’s important', house: 'Slytherin', score: 1 },
            { text: 'Organize a group study session to help everyone', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 6, 
        question: 'A friend confesses they broke a school rule, what do you do?', 
        answers: [
            { text: 'Help them fix the situation discreetly', house: 'Slytherin', score: 1 },
            { text: 'Encourage them to confess to a professor', house: 'Hufflepuff', score: 1 },
            { text: 'Support them but let them face the consequences', house: 'Gryffindor', score: 1 },
            { text: 'Figure out why they broke the rule and analyze the situation', house: 'Ravenclaw', score: 1 }
        ]
    },
    { 
        id: 7, 
        question: 'What would you do if you were given an invisibility cloak for a day?', 
        answers: [
            { text: 'Sneak into the library and explore restricted books', house: 'Ravenclaw', score: 1 },
            { text: 'Pull harmless pranks on your friends', house: 'Gryffindor', score: 1 },
            { text: 'Spy on people to learn their secrets', house: 'Slytherin', score: 1 },
            { text: 'Help someone without them knowing', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 8, 
        question: 'What kind of role would you take in a group project?', 
        answers: [
            { text: 'Leader, ensuring everyone does their part', house: 'Gryffindor', score: 1 },
            { text: 'Researcher, gathering all the necessary information', house: 'Ravenclaw', score: 1 },
            { text: 'Strategist, finding the most efficient way to complete it', house: 'Slytherin', score: 1 },
            { text: 'Supporter, helping wherever you’re needed', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 9, 
        question: 'You’re on a Quidditch team. What role do you prefer?', 
        answers: [
            { text: 'Chaser, scoring goals with skill and teamwork', house: 'Hufflepuff', score: 1 },
            { text: 'Keeper, protecting the team from losing points', house: 'Gryffindor', score: 1 },
            { text: 'Seeker, focusing on winning the game', house: 'Ravenclaw', score: 1 },
            { text: 'Beater, ensuring your team stays in control', house: 'Slytherin', score: 1 }
        ]
    },
    { 
        id: 10, 
        question: 'You hear a strange noise at night in your dormitory, what do you do?', 
        answers: [
            { text: 'Investigate it immediately, even if it’s risky', house: 'Gryffindor', score: 1 },
            { text: 'Stay awake and quietly observe for clues', house: 'Ravenclaw', score: 1 },
            { text: 'Secure yourself and make a plan to deal with it later', house: 'Slytherin', score: 1 },
            { text: 'Wake up others to ensure everyone is safe', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 11, 
        question: 'You have a free afternoon at Hogwarts. What do you do?', 
        answers: [
            { text: 'Explore the Forbidden Forest, even if it’s risky', house: 'Gryffindor', score: 1 },
            { text: 'Spend time in the library reading rare books', house: 'Ravenclaw', score: 1 },
            { text: 'Plan a secret project that benefits you', house: 'Slytherin', score: 1 },
            { text: 'Hang out with friends or help someone in need', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 12, 
        question: 'A professor offers extra credit. What’s your approach?', 
        answers: [
            { text: 'Jump at the chance to challenge yourself', house: 'Ravenclaw', score: 1 },
            { text: 'Only take it if you really need it', house: 'Hufflepuff', score: 1 },
            { text: 'Use the extra credit to gain an advantage', house: 'Slytherin', score: 1 },
            { text: 'Balance the extra work with your other commitments', house: 'Gryffindor', score: 1 }
        ]
    },
    { 
        id: 13, 
        question: 'How do you react to being assigned a difficult task?', 
        answers: [
            { text: 'Tackle it head-on, no matter how hard it seems', house: 'Gryffindor', score: 1 },
            { text: 'Analyze the task and create a detailed plan', house: 'Ravenclaw', score: 1 },
            { text: 'Look for ways to simplify or optimize the task', house: 'Slytherin', score: 1 },
            { text: 'Ask for help and ensure it’s done correctly', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 14, 
        question: 'Which magical subject excites you the most?', 
        answers: [
            { text: 'Defense Against the Dark Arts', house: 'Gryffindor', score: 1 },
            { text: 'Charms', house: 'Ravenclaw', score: 1 },
            { text: 'Potions', house: 'Slytherin', score: 1 },
            { text: 'Care of Magical Creatures', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 15, 
        question: 'What would you do if you discovered a major secret about a professor?', 
        answers: [
            { text: 'Keep it to yourself but stay vigilant', house: 'Slytherin', score: 1 },
            { text: 'Share it with close friends you trust', house: 'Hufflepuff', score: 1 },
            { text: 'Confront the professor and seek the truth', house: 'Gryffindor', score: 1 },
            { text: 'Research the secret thoroughly to understand it', house: 'Ravenclaw', score: 1 }
        ]
    },
    { 
        id: 16, 
        question: 'You’re lost in Hogwarts. What’s your first move?', 
        answers: [
            { text: 'Ask a ghost or portrait for directions', house: 'Hufflepuff', score: 1 },
            { text: 'Explore until you figure it out', house: 'Gryffindor', score: 1 },
            { text: 'Try to remember the map you saw earlier', house: 'Ravenclaw', score: 1 },
            { text: 'Look for opportunities while finding your way', house: 'Slytherin', score: 1 }
        ]
    },
    { 
        id: 17, 
        question: 'What would you bring to a wizarding duel?', 
        answers: [
            { text: 'A wand and pure courage', house: 'Gryffindor', score: 1 },
            { text: 'A list of spells you’ve mastered', house: 'Ravenclaw', score: 1 },
            { text: 'A clever plan to outsmart your opponent', house: 'Slytherin', score: 1 },
            { text: 'A friend for moral support', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 18, 
        question: 'How do you handle someone who’s bullying a friend?', 
        answers: [
            { text: 'Stand up to the bully immediately', house: 'Gryffindor', score: 1 },
            { text: 'Find a clever way to humiliate the bully', house: 'Slytherin', score: 1 },
            { text: 'Support your friend emotionally and help them move on', house: 'Hufflepuff', score: 1 },
            { text: 'Report the situation to someone in authority', house: 'Ravenclaw', score: 1 }
        ]
    },
    { 
        id: 19, 
        question: 'What motivates you the most?', 
        answers: [
            { text: 'The thrill of adventure', house: 'Gryffindor', score: 1 },
            { text: 'The pursuit of knowledge', house: 'Ravenclaw', score: 1 },
            { text: 'The ambition to achieve greatness', house: 'Slytherin', score: 1 },
            { text: 'The desire to make a positive impact', house: 'Hufflepuff', score: 1 }
        ]
    },
    { 
        id: 20, 
        question: 'You receive a Howler from home. How do you react?', 
        answers: [
            { text: 'Take it calmly and accept the scolding', house: 'Hufflepuff', score: 1 },
            { text: 'Laugh it off and try to lighten the mood', house: 'Gryffindor', score: 1 },
            { text: 'Analyze the situation to avoid future mistakes', house: 'Ravenclaw', score: 1 },
            { text: 'Ensure no one else hears it and move on', house: 'Slytherin', score: 1 }
        ]
    }
    
];


// Routes
app.get('/', (req, res) => {
    // Initialize questionIndex if it doesn't exist in session
    if (!req.session.questionIndex) {
        req.session.questionIndex = 0;  // Start quiz at the first question
    }

    // Randomly shuffle the questions and select the first 8
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 8);
    req.session.questions = shuffledQuestions;

    res.render('index');
});


app.get('/quiz', (req, res) => {
    const questionIndex = req.session.questionIndex;
    const currentQuestion = req.session.questions[questionIndex];

    // If questionIndex is out of bounds (e.g., after last question), go to the results page
    if (questionIndex >= req.session.questions.length) {
        return res.redirect('/result');
    }

    res.render('quiz', { question: currentQuestion, questionIndex, questions: req.session.questions });
});


app.post('/quiz', (req, res) => {
    const { answer } = req.body;
    const questionIndex = req.session.questionIndex;
    const currentQuestion = req.session.questions[questionIndex];
    const selectedAnswer = currentQuestion.answers.find(a => a.text === answer);

    // Update house scores based on the selected answer
    if (selectedAnswer) {
        userAnswers[selectedAnswer.house] += selectedAnswer.score;
    }

    // Increment questionIndex for the next question
    req.session.questionIndex++;

    // If it's the last question, go to the results page
    if (req.session.questionIndex >= req.session.questions.length) {
        return res.redirect('/result');
    }

    // Redirect to the next question
    res.redirect('/quiz');
});


app.get('/result', (req, res) => {
    const totalQuestions = questions.length; // Total number of questions

    // Calculate score for each house
    const houseScores = {
        Gryffindor: userAnswers.Gryffindor,
        Hufflepuff: userAnswers.Hufflepuff,
        Ravenclaw: userAnswers.Ravenclaw,
        Slytherin: userAnswers.Slytherin
    };

    // Calculate percentage for each house
    let housePercentages = {};
    let totalScore = 0;

    Object.keys(houseScores).forEach(house => {
        housePercentages[house] = Math.round((houseScores[house] / totalQuestions) * 100); // Round to whole number
        totalScore += housePercentages[house]; // Accumulate the total percentage
    });

    // Adjust the percentages to ensure they sum up to 100%
    const difference = 100 - totalScore;
    if (difference !== 0) {
        // Add the difference to the house with the highest score
        const houseWithMaxScore = Object.keys(housePercentages).reduce((a, b) => housePercentages[a] > housePercentages[b] ? a : b);
        housePercentages[houseWithMaxScore] += difference;
    }

    // Reset user answers for the next round
    req.session.questionIndex = 0;
    userAnswers = {
        Gryffindor: 0,
        Hufflepuff: 0,
        Ravenclaw: 0,
        Slytherin: 0
    };

    // Render the result page with percentages
    res.render('result', { housePercentages });
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
