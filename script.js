// Simple JavaScript for interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('School website loaded');

    // Handle authentication link
    const authLink = document.getElementById('auth-link');
    if (authLink) {
        const user = localStorage.getItem('user');
        if (user) {
            authLink.innerHTML = '<a href="#" id="sign-out">Sign Out</a>';
            document.getElementById('sign-out').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('user');
                localStorage.removeItem('userType');
                location.reload();
            });
        }
    }

    // Display public announcements
    const publicAnnouncements = document.getElementById('public-announcements');
    if (publicAnnouncements) {
        function displayPublicAnnouncements() {
            const announcements = JSON.parse(localStorage.getItem('schoolAnnouncements')) || [];
            
            if (announcements.length === 0) {
                publicAnnouncements.innerHTML = '<p>No announcements at this time.</p>';
                return;
            }

            // Show only the 3 most recent announcements
            const recentAnnouncements = announcements
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);

            let html = '';
            recentAnnouncements.forEach(announcement => {
                const date = new Date(announcement.date).toLocaleDateString();
                const priorityClass = 'priority-' + announcement.priority;
                html += '<div class="public-announcement-card ' + priorityClass + '">';
                html += '<div class="announcement-header">';
                html += '<h4>' + announcement.title + '</h4>';
                html += '<span class="announcement-date">' + date + '</span>';
                if (announcement.priority !== 'normal') {
                    html += '<span class="announcement-priority ' + priorityClass + '">' + announcement.priority.toUpperCase() + '</span>';
                }
                html += '</div>';
                html += '<div class="announcement-content">' + announcement.content.replace(/\n/g, '<br>') + '</div>';
                html += '</div>';
            });

            publicAnnouncements.innerHTML = html;
        }

        displayPublicAnnouncements();
    }

    // Handle login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            const message = document.getElementById('message');

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password && u.role === role);

            if (user) {
                localStorage.setItem('user', username);
                localStorage.setItem('userType', role);
                message.textContent = 'Login successful!';
                message.style.color = 'green';
                setTimeout(() => {
                    if (role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else if (role === 'staff') {
                        window.location.href = 'teacher-dashboard.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1000);
            } else {
                message.textContent = 'Invalid credentials.';
                message.style.color = 'red';
            }
        });
    }

    // Handle registration form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        // Handle role change to show/hide class selection
        const roleSelect = document.getElementById('reg-role');
        const classSelection = document.getElementById('class-selection');

        roleSelect.addEventListener('change', function() {
            if (this.value === 'student') {
                classSelection.style.display = 'block';
                document.getElementById('reg-class').required = true;
            } else {
                classSelection.style.display = 'none';
                document.getElementById('reg-class').required = false;
            }
        });

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value.trim();
            const role = document.getElementById('reg-role').value;
            const studentClass = document.getElementById('reg-class').value;
            const message = document.getElementById('reg-message');

            // Basic validation
            if (!username || !password) {
                message.textContent = 'Please fill in all fields.';
                message.style.color = 'red';
                return;
            }

            if (password.length < 6) {
                message.textContent = 'Password must be at least 6 characters long.';
                message.style.color = 'red';
                return;
            }

            // Class validation for students
            if (role === 'student' && !studentClass) {
                message.textContent = 'Please select your class.';
                message.style.color = 'red';
                return;
            }

            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if username already exists
            const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
            if (existingUser) {
                message.textContent = 'Username already exists. Please choose a different username.';
                message.style.color = 'red';
                return;
            }

            // Create new user
            const newUser = {
                username: username,
                password: password,
                role: role,
                class: role === 'student' ? studentClass : null,
                createdAt: new Date().toISOString()
            };

            // Add to users array
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Clear form
            registerForm.reset();
            classSelection.style.display = 'none';

            // Show success message
            const roleDisplay = role === 'student' ? `Student (${studentClass})` : role === 'staff' ? 'Staff' : 'Admin';
            message.textContent = `Account created successfully! You can now sign in as a ${roleDisplay}.`;
            message.style.color = 'green';

            // Clear message after 3 seconds
            setTimeout(() => {
                message.textContent = '';
            }, 3000);
        });
    }

    // Handle CA Tests page
    const caContent = document.getElementById('ca-content');
    if (caContent) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        if (user && userType === 'student') {
            renderCATests();
        } else {
            caContent.innerHTML = '<p>Please sign in as a student to access continuous assessment tests.</p>';
        }

        function renderCATests() {
            // Sample CA questions by subject and class
            const caQuestions = {
                mathematics: {
                    JSS1: [
                        {
                            question: "What is 15 + 27?",
                            options: ["42", "43", "41", "40"],
                            correct: 0
                        },
                        {
                            question: "What is the square root of 49?",
                            options: ["7", "8", "6", "9"],
                            correct: 0
                        },
                        {
                            question: "What is 8 × 9?",
                            options: ["72", "73", "71", "70"],
                            correct: 0
                        }
                    ],
                    JSS2: [
                        {
                            question: "Solve for x: 2x + 5 = 15",
                            options: ["5", "10", "7", "8"],
                            correct: 0
                        },
                        {
                            question: "What is the area of a rectangle with length 8cm and width 5cm?",
                            options: ["40 cm²", "45 cm²", "35 cm²", "50 cm²"],
                            correct: 0
                        }
                    ],
                    JSS3: [
                        {
                            question: "What is the value of π (pi) to 2 decimal places?",
                            options: ["3.14", "3.15", "3.13", "3.16"],
                            correct: 0
                        },
                        {
                            question: "Solve: 3(x - 2) = 12",
                            options: ["6", "5", "7", "8"],
                            correct: 0
                        }
                    ],
                    SS1: [
                        {
                            question: "What is the derivative of x²?",
                            options: ["2x", "x", "2x²", "x²"],
                            correct: 0
                        },
                        {
                            question: "What is sin(90°)?",
                            options: ["1", "0", "0.5", "-1"],
                            correct: 0
                        }
                    ],
                    SS2: [
                        {
                            question: "What is the integral of 2x dx?",
                            options: ["x² + C", "2x² + C", "x + C", "2x + C"],
                            correct: 0
                        }
                    ],
                    SS3: [
                        {
                            question: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
                            options: ["2", "1", "0", "undefined"],
                            correct: 0
                        }
                    ]
                },
                english: {
                    JSS1: [
                        {
                            question: "What is the plural of 'child'?",
                            options: ["childs", "children", "childes", "childrens"],
                            correct: 1
                        },
                        {
                            question: "Which word is a synonym of 'happy'?",
                            options: ["sad", "joyful", "angry", "tired"],
                            correct: 1
                        }
                    ],
                    JSS2: [
                        {
                            question: "Identify the tense: 'I will go to school tomorrow.'",
                            options: ["Past", "Present", "Future", "Present Continuous"],
                            correct: 2
                        }
                    ],
                    JSS3: [
                        {
                            question: "What figure of speech is used in 'The wind whispered through the trees'?",
                            options: ["Metaphor", "Personification", "Simile", "Hyperbole"],
                            correct: 1
                        }
                    ],
                    SS1: [
                        {
                            question: "What is the meaning of 'ubiquitous'?",
                            options: ["Rare", "Present everywhere", "Hidden", "Temporary"],
                            correct: 1
                        }
                    ],
                    SS2: [
                        {
                            question: "Which of these is a preposition?",
                            options: ["Run", "Quickly", "Under", "Beautiful"],
                            correct: 2
                        }
                    ],
                    SS3: [
                        {
                            question: "What is the literary device in 'The world is a stage'?",
                            options: ["Metaphor", "Simile", "Personification", "Irony"],
                            correct: 0
                        }
                    ]
                },
                science: {
                    JSS1: [
                        {
                            question: "What is the chemical symbol for water?",
                            options: ["H2O", "CO2", "O2", "N2"],
                            correct: 0
                        },
                        {
                            question: "How many planets are in our solar system?",
                            options: ["7", "8", "9", "10"],
                            correct: 1
                        }
                    ],
                    JSS2: [
                        {
                            question: "What is the process by which plants make their own food?",
                            options: ["Respiration", "Photosynthesis", "Transpiration", "Digestion"],
                            correct: 1
                        }
                    ],
                    JSS3: [
                        {
                            question: "What is the atomic number of carbon?",
                            options: ["6", "8", "12", "14"],
                            correct: 0
                        }
                    ],
                    SS1: [
                        {
                            question: "What is the unit of electric current?",
                            options: ["Volt", "Ampere", "Ohm", "Watt"],
                            correct: 1
                        }
                    ],
                    SS2: [
                        {
                            question: "What is the pH of pure water?",
                            options: ["7", "1", "14", "0"],
                            correct: 0
                        }
                    ],
                    SS3: [
                        {
                            question: "What is the speed of light in vacuum?",
                            options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁷ m/s"],
                            correct: 0
                        }
                    ]
                }
            };

            // Get user class
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const currentUser = users.find(u => u.username === user);
            const userClass = currentUser ? currentUser.class : null;

            if (!userClass) {
                caContent.innerHTML = '<p>Your class information is not available. Please contact your teacher.</p>';
                return;
            }

            // Create subject selection
            let html = '<h2>Continuous Assessment Tests</h2>';
            html += '<p>Welcome ' + user + ' (' + userClass + ')! Choose a subject to take your CA test.</p>';
            html += '<div class="subject-selection">';

            Object.keys(caQuestions).forEach(subject => {
                const capitalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
                const availableQuestions = caQuestions[subject][userClass];
                if (availableQuestions && availableQuestions.length > 0) {
                    html += '<button class="subject-btn" onclick="startCATest(\'' + subject + '\', \'' + userClass + '\')">' + capitalizedSubject + ' CA</button>';
                }
            });

            html += '</div>';
            html += '<div id="quiz-container" style="display: none;"></div>';
            html += '<div id="results-container" style="display: none;"></div>';

            caContent.innerHTML = html;
        }

        // Global functions for quiz functionality
        window.startCATest = function(subject, userClass) {
            const caQuestions = {
                mathematics: {
                    JSS1: [
                        {
                            question: "What is 15 + 27?",
                            options: ["42", "43", "41", "40"],
                            correct: 0
                        },
                        {
                            question: "What is the square root of 49?",
                            options: ["7", "8", "6", "9"],
                            correct: 0
                        },
                        {
                            question: "What is 8 × 9?",
                            options: ["72", "73", "71", "70"],
                            correct: 0
                        }
                    ],
                    JSS2: [
                        {
                            question: "Solve for x: 2x + 5 = 15",
                            options: ["5", "10", "7", "8"],
                            correct: 0
                        },
                        {
                            question: "What is the area of a rectangle with length 8cm and width 5cm?",
                            options: ["40 cm²", "45 cm²", "35 cm²", "50 cm²"],
                            correct: 0
                        }
                    ],
                    JSS3: [
                        {
                            question: "What is the value of π (pi) to 2 decimal places?",
                            options: ["3.14", "3.15", "3.13", "3.16"],
                            correct: 0
                        },
                        {
                            question: "Solve: 3(x - 2) = 12",
                            options: ["6", "5", "7", "8"],
                            correct: 0
                        }
                    ],
                    SS1: [
                        {
                            question: "What is the derivative of x²?",
                            options: ["2x", "x", "2x²", "x²"],
                            correct: 0
                        },
                        {
                            question: "What is sin(90°)?",
                            options: ["1", "0", "0.5", "-1"],
                            correct: 0
                        }
                    ],
                    SS2: [
                        {
                            question: "What is the integral of 2x dx?",
                            options: ["x² + C", "2x² + C", "x + C", "2x + C"],
                            correct: 0
                        }
                    ],
                    SS3: [
                        {
                            question: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
                            options: ["2", "1", "0", "undefined"],
                            correct: 0
                        }
                    ]
                },
                english: {
                    JSS1: [
                        {
                            question: "What is the plural of 'child'?",
                            options: ["childs", "children", "childes", "childrens"],
                            correct: 1
                        },
                        {
                            question: "Which word is a synonym of 'happy'?",
                            options: ["sad", "joyful", "angry", "tired"],
                            correct: 1
                        }
                    ],
                    JSS2: [
                        {
                            question: "Identify the tense: 'I will go to school tomorrow.'",
                            options: ["Past", "Present", "Future", "Present Continuous"],
                            correct: 2
                        }
                    ],
                    JSS3: [
                        {
                            question: "What figure of speech is used in 'The wind whispered through the trees'?",
                            options: ["Metaphor", "Personification", "Simile", "Hyperbole"],
                            correct: 1
                        }
                    ],
                    SS1: [
                        {
                            question: "What is the meaning of 'ubiquitous'?",
                            options: ["Rare", "Present everywhere", "Hidden", "Temporary"],
                            correct: 1
                        }
                    ],
                    SS2: [
                        {
                            question: "Which of these is a preposition?",
                            options: ["Run", "Quickly", "Under", "Beautiful"],
                            correct: 2
                        }
                    ],
                    SS3: [
                        {
                            question: "What is the literary device in 'The world is a stage'?",
                            options: ["Metaphor", "Simile", "Personification", "Irony"],
                            correct: 0
                        }
                    ]
                },
                science: {
                    JSS1: [
                        {
                            question: "What is the chemical symbol for water?",
                            options: ["H2O", "CO2", "O2", "N2"],
                            correct: 0
                        },
                        {
                            question: "How many planets are in our solar system?",
                            options: ["7", "8", "9", "10"],
                            correct: 1
                        }
                    ],
                    JSS2: [
                        {
                            question: "What is the process by which plants make their own food?",
                            options: ["Respiration", "Photosynthesis", "Transpiration", "Digestion"],
                            correct: 1
                        }
                    ],
                    JSS3: [
                        {
                            question: "What is the atomic number of carbon?",
                            options: ["6", "8", "12", "14"],
                            correct: 0
                        }
                    ],
                    SS1: [
                        {
                            question: "What is the unit of electric current?",
                            options: ["Volt", "Ampere", "Ohm", "Watt"],
                            correct: 1
                        }
                    ],
                    SS2: [
                        {
                            question: "What is the pH of pure water?",
                            options: ["7", "1", "14", "0"],
                            correct: 0
                        }
                    ],
                    SS3: [
                        {
                            question: "What is the speed of light in vacuum?",
                            options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10¹⁰ m/s", "3 × 10⁷ m/s"],
                            correct: 0
                        }
                    ]
                }
            };

            // Check for teacher-uploaded questions first
            let questions = null;
            const user = localStorage.getItem('user');
            
            // Try to find uploaded questions from any teacher
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(`caQuestions_${subject}_${userClass}`)) {
                    const uploadedPaper = JSON.parse(localStorage.getItem(key));
                    if (uploadedPaper.questions && uploadedPaper.questions.length > 0) {
                        questions = uploadedPaper.questions;
                        break;
                    }
                }
            }

            // Fall back to sample questions if no uploaded questions found
            if (!questions) {
                questions = caQuestions[subject][userClass];
            }

            let currentQuestion = 0;
            let score = 0;
            let answers = [];

            function showQuestion() {
                if (currentQuestion >= questions.length) {
                    showResults();
                    return;
                }

                const question = questions[currentQuestion];
                const quizContainer = document.getElementById('quiz-container');
                quizContainer.style.display = 'block';
                document.querySelector('.subject-selection').style.display = 'none';

                let html = '<div class="quiz-question">';
                html += '<h3>Question ' + (currentQuestion + 1) + ' of ' + questions.length + '</h3>';
                html += '<p>' + question.question + '</p>';
                html += '<div class="options">';

                question.options.forEach((option, index) => {
                    html += '<label class="option"><input type="radio" name="answer" value="' + index + '"> ' + option + '</label>';
                });

                html += '</div>';
                html += '<button onclick="submitAnswer()">Submit Answer</button>';
                html += '</div>';

                quizContainer.innerHTML = html;
            }

            window.submitAnswer = function() {
                const selectedOption = document.querySelector('input[name="answer"]:checked');
                if (!selectedOption) {
                    alert('Please select an answer!');
                    return;
                }

                const answer = parseInt(selectedOption.value);
                answers.push(answer);

                if (answer === questions[currentQuestion].correct) {
                    score++;
                }

                currentQuestion++;
                showQuestion();
            };

            function showResults() {
                const percentage = Math.round((score / questions.length) * 100);
                const quizContainer = document.getElementById('quiz-container');
                const resultsContainer = document.getElementById('results-container');

                quizContainer.style.display = 'none';
                resultsContainer.style.display = 'block';

                let grade = 'F';
                if (percentage >= 90) grade = 'A+';
                else if (percentage >= 80) grade = 'A';
                else if (percentage >= 70) grade = 'B+';
                else if (percentage >= 60) grade = 'B';
                else if (percentage >= 50) grade = 'C';
                else if (percentage >= 40) grade = 'D';

                // Save CA result
                const caResults = JSON.parse(localStorage.getItem('caResults')) || [];
                const result = {
                    student: user,
                    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
                    score: score,
                    total: questions.length,
                    percentage: percentage,
                    grade: grade,
                    date: new Date().toISOString(),
                    class: userClass
                };

                // Check if student already took this CA
                const existingIndex = caResults.findIndex(r => r.student === user && r.subject.toLowerCase() === subject.toLowerCase());
                if (existingIndex >= 0) {
                    caResults[existingIndex] = result;
                } else {
                    caResults.push(result);
                }

                localStorage.setItem('caResults', JSON.stringify(caResults));

                let html = '<div class="ca-results">';
                html += '<h3>CA Test Results</h3>';
                html += '<div class="result-card">';
                html += '<h4>' + subject.charAt(0).toUpperCase() + subject.slice(1) + ' Continuous Assessment</h4>';
                html += '<p><strong>Student:</strong> ' + user + ' (' + userClass + ')</p>';
                html += '<p><strong>Score:</strong> ' + score + '/' + questions.length + '</p>';
                html += '<p><strong>Percentage:</strong> ' + percentage + '%</p>';
                html += '<p><strong>Grade:</strong> ' + grade + '</p>';
                html += '<p><strong>Date:</strong> ' + new Date().toLocaleDateString() + '</p>';
                html += '</div>';
                html += '<button onclick="retakeCA(\'' + subject + '\', \'' + userClass + '\')">Retake Test</button>';
                html += '<button onclick="backToSubjects()">Back to Subjects</button>';
                html += '</div>';

                resultsContainer.innerHTML = html;
            }

            window.retakeCA = function(subject, userClass) {
                currentQuestion = 0;
                score = 0;
                answers = [];
                document.getElementById('results-container').style.display = 'none';
                startCATest(subject, userClass);
            };

            window.backToSubjects = function() {
                document.getElementById('quiz-container').style.display = 'none';
                document.getElementById('results-container').style.display = 'none';
                document.querySelector('.subject-selection').style.display = 'block';
            };

            showQuestion();
        };
    }

    // Switch between tabs in teacher dashboard
    window.switchTab = function(tabName) {
        // Hide all tabs
        const allTabs = document.querySelectorAll('.tab-content');
        allTabs.forEach(tab => tab.style.display = 'none');

        // Remove active class from all buttons
        const allBtns = document.querySelectorAll('.tab-btn');
        allBtns.forEach(btn => btn.classList.remove('active'));

        // Show selected tab and mark button as active
        const tabMap = {
            'exam-scores': 'exam-scores-tab',
            'ca-upload': 'ca-upload-tab',
            'student-management': 'student-management-tab',
            'analytics': 'analytics-tab',
            'announcements': 'announcements-tab',
            'photo-gallery': 'photo-gallery-tab',
            'school-news': 'school-news-tab'
        };

        if (tabMap[tabName]) {
            const tabElement = document.getElementById(tabMap[tabName]);
            if (tabElement) tabElement.style.display = 'block';
            event.target.classList.add('active');
        }
    };

    // Handle CA Upload content
    const caUploadContent = document.getElementById('ca-upload-content');
    if (caUploadContent) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        function renderCAUploadForm() {
            let html = '<h2>Upload CA Questions (20 Questions - 1 Mark Each)</h2>';
            html += '<div class="ca-upload-form">';
            html += '<h3>Add New CA Question Paper</h3>';
            html += '<form id="ca-question-form">';
            
            html += '<div class="form-row">';
            html += '<div class="form-group">';
            html += '<label for="ca-subject">Subject:</label>';
            html += '<input type="text" id="ca-subject" placeholder="e.g., Mathematics, English, Science" required>';
            html += '</div>';
            
            html += '<div class="form-group">';
            html += '<label for="ca-class">Class:</label>';
            html += '<select id="ca-class" required>';
            html += '<option value="">Select Class</option>';
            html += '<option value="JSS1">JSS1</option>';
            html += '<option value="JSS2">JSS2</option>';
            html += '<option value="JSS3">JSS3</option>';
            html += '<option value="SS1">SS1</option>';
            html += '<option value="SS2">SS2</option>';
            html += '<option value="SS3">SS3</option>';
            html += '</select>';
            html += '</div>';
            html += '</div>';

            html += '<div id="questions-form-container"></div>';
            html += '<button type="submit">Save Question Paper</button>';
            html += '</form>';
            html += '<p id="ca-upload-message"></p>';
            html += '</div>';

            // List of uploaded question papers
            html += '<h3>Uploaded Question Papers</h3>';
            html += '<div id="uploaded-papers-list"></div>';

            caUploadContent.innerHTML = html;
            renderQuestionInputs();
            renderUploadedPapers();

            const caQuestionForm = document.getElementById('ca-question-form');
            if (caQuestionForm) {
                caQuestionForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const subject = document.getElementById('ca-subject').value;
                    const classLevel = document.getElementById('ca-class').value;
                    const message = document.getElementById('ca-upload-message');

                    if (!subject || !classLevel) {
                        message.textContent = 'Please enter subject and select class.';
                        message.style.color = 'red';
                        return;
                    }

                    // Collect all questions
                    const questions = [];
                    for (let i = 1; i <= 20; i++) {
                        const questionText = document.getElementById(`q${i}-text`)?.value.trim();
                        const opt1 = document.getElementById(`q${i}-opt1`)?.value.trim();
                        const opt2 = document.getElementById(`q${i}-opt2`)?.value.trim();
                        const opt3 = document.getElementById(`q${i}-opt3`)?.value.trim();
                        const opt4 = document.getElementById(`q${i}-opt4`)?.value.trim();
                        const correct = parseInt(document.getElementById(`q${i}-correct`)?.value) || 0;

                        if (questionText && opt1 && opt2 && opt3 && opt4) {
                            questions.push({
                                question: questionText,
                                options: [opt1, opt2, opt3, opt4],
                                correct: correct
                            });
                        }
                    }

                    if (questions.length === 0) {
                        message.textContent = 'Please enter at least one question with all options.';
                        message.style.color = 'red';
                        return;
                    }

                    // Save to localStorage
                    const paperKey = `caQuestions_${subject}_${classLevel}_${user}`;
                    const paper = {
                        subject: subject,
                        class: classLevel,
                        teacher: user,
                        questions: questions,
                        totalMarks: questions.length,
                        createdAt: new Date().toISOString()
                    };

                    localStorage.setItem(paperKey, JSON.stringify(paper));

                    message.textContent = `Question paper saved! ${questions.length} questions uploaded for ${subject} (${classLevel})`;
                    message.style.color = 'green';

                    // Reset form
                    setTimeout(() => {
                        caQuestionForm.reset();
                        renderCAUploadForm();
                    }, 1500);
                });
            }
        }

        function renderQuestionInputs() {
            const container = document.getElementById('questions-form-container');
            if (!container) return;

            let html = '';
            for (let i = 1; i <= 20; i++) {
                html += `<div style="background-color: #f5f5f5; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px;">`;
                html += `<h4>Question ${i}</h4>`;
                
                html += `<div class="form-group">`;
                html += `<label for="q${i}-text">Question Text:</label>`;
                html += `<textarea id="q${i}-text" placeholder="Enter question ${i}"></textarea>`;
                html += `</div>`;

                html += `<div class="options-container">`;
                html += `<label>Options (select correct answer):</label>`;
                
                for (let j = 0; j < 4; j++) {
                    const optionLetter = String.fromCharCode(65 + j); // A, B, C, D
                    html += `<div class="option-input-group">`;
                    html += `<label>${optionLetter}:</label>`;
                    html += `<input type="text" id="q${i}-opt${j+1}" placeholder="Option ${optionLetter}" />`;
                    html += `<input type="radio" name="q${i}-correct" value="${j}" id="q${i}-correct-${j}">`;
                    html += `</div>`;
                }
                
                html += `</div>`;
                html += `</div>`;
            }

            container.innerHTML = html;
        }

        function renderUploadedPapers() {
            const papersList = document.getElementById('uploaded-papers-list');
            if (!papersList) return;

            let html = '<table class="questions-table">';
            html += '<thead><tr><th>Subject</th><th>Class</th><th>Questions</th><th>Total Marks</th><th>Date Created</th><th>Action</th></tr></thead>';
            html += '<tbody>';

            const allPapers = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(`caQuestions_`)) {
                    const paper = JSON.parse(localStorage.getItem(key));
                    if (paper.teacher === user) {
                        allPapers.push({ key, ...paper });
                    }
                }
            }

            if (allPapers.length === 0) {
                html += '<tr><td colspan="6">No question papers uploaded yet.</td></tr>';
            } else {
                allPapers.forEach(paper => {
                    const dateCreated = new Date(paper.createdAt).toLocaleDateString();
                    html += `<tr>`;
                    html += `<td>${paper.subject.charAt(0).toUpperCase() + paper.subject.slice(1)}</td>`;
                    html += `<td>${paper.class}</td>`;
                    html += `<td>${paper.questions.length}</td>`;
                    html += `<td>${paper.totalMarks}</td>`;
                    html += `<td>${dateCreated}</td>`;
                    html += `<td><button class="btn-delete-question" onclick="deleteCAQuestion('${paper.key}')">Delete</button></td>`;
                    html += `</tr>`;
                });
            }

            html += '</tbody></table>';
            papersList.innerHTML = html;
        }

        window.deleteCAQuestion = function(key) {
            if (confirm('Are you sure you want to delete this question paper?')) {
                localStorage.removeItem(key);
                renderUploadedPapers();
            }
        };

        if (user && (userType === 'staff' || userType === 'admin')) {
            renderCAUploadForm();
        } else if (user && userType === 'student') {
            caUploadContent.innerHTML = '<p>Staff or admin only: sign in with a staff or admin account to upload CA questions.</p>';
        } else {
            caUploadContent.innerHTML = '<p>Please sign in as a staff or admin member to upload CA questions.</p>';
        }
    }

    // Handle Student Management content
    const studentManagementContent = document.getElementById('student-management-content');
    if (studentManagementContent) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        function renderStudentManagement() {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const students = users.filter(u => u.role === 'student');
            const staff = users.filter(u => u.role === 'staff');
            const admins = users.filter(u => u.role === 'admin');

            let html = '<h2>User Management</h2>';

            // User Role Management Section
            html += '<div class="user-management-section">';
            html += '<h3>Change User Roles</h3>';
            html += '<p>Use this section to change user roles (student ↔ staff ↔ admin)</p>';
            html += '<div class="role-change-form">';
            html += '<select id="user-select">';
            html += '<option value="">Select a user...</option>';
            users.forEach(user => {
                html += '<option value="' + user.username + '">' + user.username + ' (Current: ' + user.role + ')</option>';
            });
            html += '</select>';
            html += '<select id="new-role">';
            html += '<option value="">Select new role...</option>';
            html += '<option value="student">Student</option>';
            html += '<option value="staff">Staff</option>';
            html += '<option value="admin">Admin</option>';
            html += '</select>';
            html += '<button onclick="changeUserRole()" class="btn-change-role">Change Role</button>';
            html += '</div>';
            html += '</div>';

            // Students Section
            html += '<h3>Registered Students (' + students.length + ')</h3>';
            if (students.length === 0) {
                html += '<p>No students registered yet.</p>';
            } else {
                html += '<table class="students-table">';
                html += '<thead><tr><th>Username</th><th>Class</th><th>Registration Date</th><th>Actions</th></tr></thead>';
                html += '<tbody>';
                students.forEach(student => {
                    const regDate = new Date(student.createdAt).toLocaleDateString();
                    html += '<tr>';
                    html += '<td>' + student.username + '</td>';
                    html += '<td>' + (student.class || 'Not assigned') + '</td>';
                    html += '<td>' + regDate + '</td>';
                    html += '<td><button class="btn-view-details" onclick="viewStudentDetails(\'' + student.username + '\')">View Details</button></td>';
                    html += '</tr>';
                });
                html += '</tbody></table>';
            }

            // Staff Section
            html += '<h3>Staff Members (' + staff.length + ')</h3>';
            if (staff.length === 0) {
                html += '<p>No staff members registered yet.</p>';
            } else {
                html += '<table class="staff-table">';
                html += '<thead><tr><th>Username</th><th>Role</th><th>Registration Date</th></tr></thead>';
                html += '<tbody>';
                staff.forEach(member => {
                    const regDate = new Date(member.createdAt).toLocaleDateString();
                    html += '<tr>';
                    html += '<td>' + member.username + '</td>';
                    html += '<td>Staff</td>';
                    html += '<td>' + regDate + '</td>';
                    html += '</tr>';
                });
                html += '</tbody></table>';
            }

            // Admin Section
            html += '<h3>Administrators (' + admins.length + ')</h3>';
            if (admins.length === 0) {
                html += '<p>No administrators registered yet.</p>';
            } else {
                html += '<table class="admin-table">';
                html += '<thead><tr><th>Username</th><th>Role</th><th>Registration Date</th></tr></thead>';
                html += '<tbody>';
                admins.forEach(member => {
                    const regDate = new Date(member.createdAt).toLocaleDateString();
                    html += '<tr>';
                    html += '<td>' + member.username + '</td>';
                    html += '<td>Admin</td>';
                    html += '<td>' + regDate + '</td>';
                    html += '</tr>';
                });
                html += '</tbody></table>';
            }

            // Student Details Modal (hidden by default)
            html += '<div id="student-details-modal" class="modal" style="display: none;">';
            html += '<div class="modal-content">';
            html += '<span class="close-modal" onclick="closeStudentModal()">&times;</span>';
            html += '<div id="student-details-content"></div>';
            html += '</div>';
            html += '</div>';

            studentManagementContent.innerHTML = html;
        }

        window.viewStudentDetails = function(username) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const student = users.find(u => u.username === username);
            const examResults = JSON.parse(localStorage.getItem('examResults')) || [];
            const caResults = JSON.parse(localStorage.getItem('caResults')) || [];

            const studentExamResults = examResults.filter(r => r.student === username);
            const studentCAResults = caResults.filter(r => r.student === username);

            let html = '<h3>Student Details: ' + username + '</h3>';
            html += '<p><strong>Class:</strong> ' + (student.class || 'Not assigned') + '</p>';
            html += '<p><strong>Registration Date:</strong> ' + new Date(student.createdAt).toLocaleDateString() + '</p>';

            // Final Exam Results
            html += '<h4>Final Exam Results</h4>';
            if (studentExamResults.length === 0) {
                html += '<p>No final exam results recorded.</p>';
            } else {
                html += '<table class="results-table">';
                html += '<thead><tr><th>Subject</th><th>Exam</th><th>Test</th><th>Total</th><th>Grade</th></tr></thead><tbody>';
                studentExamResults.forEach(result => {
                    html += '<tr><td>' + result.subject + '</td><td>' + result.exam + '</td><td>' + result.test + '</td><td>' + result.total + '</td><td>' + result.grade + '</td></tr>';
                });
                html += '</tbody></table>';
            }

            // CA Results
            html += '<h4>CA Test Results</h4>';
            if (studentCAResults.length === 0) {
                html += '<p>No CA results recorded.</p>';
            } else {
                html += '<table class="results-table">';
                html += '<thead><tr><th>Subject</th><th>Score</th><th>Percentage</th><th>Grade</th><th>Date</th></tr></thead><tbody>';
                studentCAResults.forEach(result => {
                    const date = new Date(result.date).toLocaleDateString();
                    html += '<tr><td>' + result.subject + '</td><td>' + result.score + '/' + result.total + '</td><td>' + result.percentage + '%</td><td>' + result.grade + '</td><td>' + date + '</td></tr>';
                });
                html += '</tbody></table>';
            }

            document.getElementById('student-details-content').innerHTML = html;
            document.getElementById('student-details-modal').style.display = 'block';
        };

        window.closeStudentModal = function() {
            document.getElementById('student-details-modal').style.display = 'none';
        };

        window.changeUserRole = function() {
            const userSelect = document.getElementById('user-select');
            const newRoleSelect = document.getElementById('new-role');
            const selectedUsername = userSelect.value;
            const newRole = newRoleSelect.value;

            if (!selectedUsername || !newRole) {
                alert('Please select both a user and a new role.');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.username === selectedUsername);

            if (userIndex === -1) {
                alert('User not found.');
                return;
            }

            const currentUser = localStorage.getItem('user');
            const currentUserType = localStorage.getItem('userType');

            // Prevent changing your own role if you're the only admin
            if (selectedUsername === currentUser && currentUserType === 'admin') {
                const adminCount = users.filter(u => u.role === 'admin').length;
                if (adminCount === 1 && newRole !== 'admin') {
                    alert('You cannot change your role as you are the only administrator. Please create another admin first.');
                    return;
                }
            }

            // Confirm the change
            const oldRole = users[userIndex].role;
            if (!confirm(`Are you sure you want to change ${selectedUsername}'s role from ${oldRole} to ${newRole}?`)) {
                return;
            }

            // Update the user's role
            users[userIndex].role = newRole;
            localStorage.setItem('users', JSON.stringify(users));

            // If changing current user's role, update their session
            if (selectedUsername === currentUser) {
                localStorage.setItem('userType', newRole);
                alert(`Your role has been changed to ${newRole}. You may need to refresh the page for all changes to take effect.`);
            } else {
                alert(`User ${selectedUsername}'s role has been changed to ${newRole}.`);
            }

            // Refresh the management interface
            renderStudentManagement();
        };

        if (user && (userType === 'staff' || userType === 'admin')) {
            renderStudentManagement();
        } else if (user && userType === 'student') {
            studentManagementContent.innerHTML = '<p>Staff or admin only: sign in with a staff or admin account to manage students.</p>';
        } else {
            studentManagementContent.innerHTML = '<p>Please sign in as a staff or admin member to manage students.</p>';
        }
    }

    // Handle Analytics content
    const analyticsContent = document.getElementById('analytics-content');
    if (analyticsContent) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        function renderAnalytics() {
            const examResults = JSON.parse(localStorage.getItem('examResults')) || [];
            const caResults = JSON.parse(localStorage.getItem('caResults')) || [];
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const students = users.filter(u => u.role === 'student');

            let html = '<h2>Class Analytics & Performance</h2>';

            // Overall Statistics
            html += '<div class="analytics-cards">';
            html += '<div class="analytics-card">';
            html += '<h3>Total Students</h3>';
            html += '<p class="stat-number">' + students.length + '</p>';
            html += '</div>';

            html += '<div class="analytics-card">';
            html += '<h3>Final Exams Recorded</h3>';
            html += '<p class="stat-number">' + examResults.length + '</p>';
            html += '</div>';

            html += '<div class="analytics-card">';
            html += '<h3>CA Tests Taken</h3>';
            html += '<p class="stat-number">' + caResults.length + '</p>';
            html += '</div>';
            html += '</div>';

            // Class-wise Performance
            html += '<h3>Class-wise Performance</h3>';
            const classes = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
            const classStats = {};

            classes.forEach(className => {
                const classStudents = students.filter(s => s.class === className);
                const classExamResults = examResults.filter(r => {
                    const student = students.find(s => s.username === r.student);
                    return student && student.class === className;
                });
                const classCAResults = caResults.filter(r => {
                    const student = students.find(s => s.username === r.student);
                    return student && student.class === className;
                });

                if (classStudents.length > 0) {
                    const avgExamScore = classExamResults.length > 0 ?
                        Math.round(classExamResults.reduce((sum, r) => sum + r.total, 0) / classExamResults.length) : 0;
                    const avgCAScore = classCAResults.length > 0 ?
                        Math.round(classCAResults.reduce((sum, r) => sum + r.percentage, 0) / classCAResults.length) : 0;

                    classStats[className] = {
                        students: classStudents.length,
                        exams: classExamResults.length,
                        caTests: classCAResults.length,
                        avgExam: avgExamScore,
                        avgCA: avgCAScore
                    };
                }
            });

            html += '<table class="analytics-table">';
            html += '<thead><tr><th>Class</th><th>Students</th><th>Exams Taken</th><th>CA Tests Taken</th><th>Avg Exam Score</th><th>Avg CA Score</th></tr></thead>';
            html += '<tbody>';
            Object.keys(classStats).forEach(className => {
                const stats = classStats[className];
                html += '<tr>';
                html += '<td>' + className + '</td>';
                html += '<td>' + stats.students + '</td>';
                html += '<td>' + stats.exams + '</td>';
                html += '<td>' + stats.caTests + '</td>';
                html += '<td>' + (stats.avgExam > 0 ? stats.avgExam + '%' : 'N/A') + '</td>';
                html += '<td>' + (stats.avgCA > 0 ? stats.avgCA + '%' : 'N/A') + '</td>';
                html += '</tr>';
            });
            html += '</tbody></table>';

            // Grade Distribution
            html += '<h3>Grade Distribution (Final Exams)</h3>';
            const gradeCounts = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
            examResults.forEach(result => {
                if (gradeCounts.hasOwnProperty(result.grade)) {
                    gradeCounts[result.grade]++;
                }
            });

            html += '<div class="grade-distribution">';
            Object.keys(gradeCounts).forEach(grade => {
                const percentage = examResults.length > 0 ? Math.round((gradeCounts[grade] / examResults.length) * 100) : 0;
                html += '<div class="grade-bar">';
                html += '<div class="grade-label">' + grade + '</div>';
                html += '<div class="grade-count">' + gradeCounts[grade] + ' students</div>';
                html += '<div class="grade-percentage">' + percentage + '%</div>';
                html += '<div class="grade-fill" style="width: ' + percentage + '%"></div>';
                html += '</div>';
            });
            html += '</div>';

            analyticsContent.innerHTML = html;
        }

        if (user && (userType === 'staff' || userType === 'admin')) {
            renderAnalytics();
        } else if (user && userType === 'student') {
            analyticsContent.innerHTML = '<p>Staff or admin only: sign in with a staff or admin account to view analytics.</p>';
        } else {
            analyticsContent.innerHTML = '<p>Please sign in as a staff or admin member to view analytics.</p>';
        }
    }

    // Handle Announcements content
    const announcementsContent = document.getElementById('announcements-content');
    if (announcementsContent) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        function renderAnnouncements() {
            const announcements = JSON.parse(localStorage.getItem('schoolAnnouncements')) || [];

            let html = '<h2>School Announcements</h2>';

            // Add New Announcement Form
            html += '<div class="announcement-form">';
            html += '<h3>Post New Announcement</h3>';
            html += '<form id="announcement-form">';
            html += '<div class="form-group">';
            html += '<label for="announcement-title">Title:</label>';
            html += '<input type="text" id="announcement-title" placeholder="Announcement title" required>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="announcement-content">Content:</label>';
            html += '<textarea id="announcement-content" placeholder="Announcement details..." rows="4" required></textarea>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="announcement-priority">Priority:</label>';
            html += '<select id="announcement-priority">';
            html += '<option value="normal">Normal</option>';
            html += '<option value="important">Important</option>';
            html += '<option value="urgent">Urgent</option>';
            html += '</select>';
            html += '</div>';
            html += '<button type="submit">Post Announcement</button>';
            html += '</form>';
            html += '<p id="announcement-message"></p>';
            html += '</div>';

            // Existing Announcements
            html += '<h3>Posted Announcements (' + announcements.length + ')</h3>';
            if (announcements.length === 0) {
                html += '<p>No announcements posted yet.</p>';
            } else {
                html += '<div class="announcements-list">';
                announcements.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((announcement, index) => {
                    const date = new Date(announcement.date).toLocaleDateString();
                    const priorityClass = 'priority-' + announcement.priority;
                    html += '<div class="announcement-card ' + priorityClass + '">';
                    html += '<div class="announcement-header">';
                    html += '<h4>' + announcement.title + '</h4>';
                    html += '<span class="announcement-date">' + date + '</span>';
                    html += '<span class="announcement-priority ' + priorityClass + '">' + announcement.priority.toUpperCase() + '</span>';
                    html += '<button class="btn-delete-announcement" onclick="deleteAnnouncement(' + index + ')">Delete</button>';
                    html += '</div>';
                    html += '<div class="announcement-content">' + announcement.content.replace(/\n/g, '<br>') + '</div>';
                    html += '<div class="announcement-author">Posted by: ' + announcement.author + '</div>';
                    html += '</div>';
                });
                html += '</div>';
            }

            announcementsContent.innerHTML = html;

            // Handle form submission
            const announcementForm = document.getElementById('announcement-form');
            if (announcementForm) {
                announcementForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const title = document.getElementById('announcement-title').value.trim();
                    const content = document.getElementById('announcement-content').value.trim();
                    const priority = document.getElementById('announcement-priority').value;
                    const message = document.getElementById('announcement-message');

                    if (title && content) {
                        const newAnnouncement = {
                            title: title,
                            content: content,
                            priority: priority,
                            author: user,
                            date: new Date().toISOString()
                        };

                        announcements.push(newAnnouncement);
                        localStorage.setItem('schoolAnnouncements', JSON.stringify(announcements));

                        message.textContent = 'Announcement posted successfully!';
                        message.style.color = 'green';
                        announcementForm.reset();
                        setTimeout(() => renderAnnouncements(), 1500);
                    } else {
                        message.textContent = 'Please fill in all fields.';
                        message.style.color = 'red';
                    }
                });
            }
        }

        window.deleteAnnouncement = function(index) {
            if (confirm('Are you sure you want to delete this announcement?')) {
                const announcements = JSON.parse(localStorage.getItem('schoolAnnouncements')) || [];
                announcements.splice(index, 1);
                localStorage.setItem('schoolAnnouncements', JSON.stringify(announcements));
                renderAnnouncements();
            }
        };

        if (user && (userType === 'staff' || userType === 'admin')) {
            renderAnnouncements();
        } else if (user && userType === 'student') {
            announcementsContent.innerHTML = '<p>Staff or admin only: sign in with a staff or admin account to manage announcements.</p>';
        } else {
            announcementsContent.innerHTML = '<p>Please sign in as a staff or admin member to manage announcements.</p>';
        }
    }

    // Handle Photo Gallery content
    const photoGalleryContent = document.getElementById('photo-gallery-content');
    if (photoGalleryContent) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        function renderPhotoGallery() {
            let html = '<h2>Photo Gallery Management</h2>';
            html += '<div class="photo-upload-section">';
            html += '<h3>Upload New Photo</h3>';
            html += '<form id="photo-upload-form" enctype="multipart/form-data">';
            html += '<div class="form-group">';
            html += '<label for="photo-file">Select Photo:</label>';
            html += '<input type="file" id="photo-file" accept="image/*" required>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="photo-title">Photo Title:</label>';
            html += '<input type="text" id="photo-title" placeholder="e.g., Basketball Championship 2026" required>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="photo-description">Description:</label>';
            html += '<textarea id="photo-description" placeholder="Brief description of the photo..." rows="2"></textarea>';
            html += '</div>';
            html += '<button type="submit" class="btn-upload">Upload Photo</button>';
            html += '</div>';
            html += '</form>';
            html += '</div>';

            // Current photos management
            html += '<div class="current-photos-section">';
            html += '<h3>Current Photos</h3>';
            html += '<div id="photos-grid" class="photos-grid">';
            html += '</div>';
            html += '</div>';

            photoGalleryContent.innerHTML = html;

            // Load existing photos
            loadPhotos();

            // Handle photo upload
            const photoForm = document.getElementById('photo-upload-form');
            if (photoForm) {
                photoForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const fileInput = document.getElementById('photo-file');
                    const title = document.getElementById('photo-title').value.trim();
                    const description = document.getElementById('photo-description').value.trim();

                    if (!fileInput.files[0]) {
                        alert('Please select a photo to upload.');
                        return;
                    }

                    if (!title) {
                        alert('Please enter a title for the photo.');
                        return;
                    }

                    const file = fileInput.files[0];
                    const reader = new FileReader();

                    reader.onload = function(e) {
                        const photos = JSON.parse(localStorage.getItem('schoolPhotos')) || [];
                        const newPhoto = {
                            id: Date.now(),
                            title: title,
                            description: description,
                            data: e.target.result,
                            filename: file.name,
                            uploadedAt: new Date().toISOString(),
                            uploadedBy: user
                        };

                        photos.push(newPhoto);
                        localStorage.setItem('schoolPhotos', JSON.stringify(photos));

                        // Reset form
                        photoForm.reset();
                        loadPhotos();

                        alert('Photo uploaded successfully!');
                    };

                    reader.readAsDataURL(file);
                });
            }
        }

        function loadPhotos() {
            const photos = JSON.parse(localStorage.getItem('schoolPhotos')) || [];
            const photosGrid = document.getElementById('photos-grid');

            if (!photosGrid) return;

            if (photos.length === 0) {
                photosGrid.innerHTML = '<p>No photos uploaded yet.</p>';
                return;
            }

            let html = '';
            photos.forEach(photo => {
                const uploadDate = new Date(photo.uploadedAt).toLocaleDateString();
                html += '<div class="photo-item">';
                html += '<img src="' + photo.data + '" alt="' + photo.title + '" class="photo-thumbnail">';
                html += '<div class="photo-info">';
                html += '<h4>' + photo.title + '</h4>';
                html += '<p>' + (photo.description || 'No description') + '</p>';
                html += '<small>Uploaded: ' + uploadDate + ' by ' + photo.uploadedBy + '</small>';
                html += '<div class="photo-actions">';
                html += '<button class="btn-delete-photo" onclick="deletePhoto(' + photo.id + ')">Delete</button>';
                html += '<button class="btn-replace-photo" onclick="replacePhoto(' + photo.id + ')">Replace</button>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            });

            photosGrid.innerHTML = html;
        }

        window.deletePhoto = function(photoId) {
            if (confirm('Are you sure you want to delete this photo?')) {
                const photos = JSON.parse(localStorage.getItem('schoolPhotos')) || [];
                const updatedPhotos = photos.filter(p => p.id !== photoId);
                localStorage.setItem('schoolPhotos', JSON.stringify(updatedPhotos));
                loadPhotos();
            }
        };

        window.replacePhoto = function(photoId) {
            const newTitle = prompt('Enter new title for the photo:');
            if (!newTitle) return;

            const newDescription = prompt('Enter new description (optional):');

            // Create file input for replacement
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    const photos = JSON.parse(localStorage.getItem('schoolPhotos')) || [];
                    const photoIndex = photos.findIndex(p => p.id === photoId);

                    if (photoIndex !== -1) {
                        photos[photoIndex].title = newTitle;
                        photos[photoIndex].description = newDescription || photos[photoIndex].description;
                        photos[photoIndex].data = e.target.result;
                        photos[photoIndex].filename = file.name;
                        photos[photoIndex].uploadedAt = new Date().toISOString();
                        photos[photoIndex].uploadedBy = user;

                        localStorage.setItem('schoolPhotos', JSON.stringify(photos));
                        loadPhotos();
                        alert('Photo replaced successfully!');
                    }
                };
                reader.readAsDataURL(file);
            };
            input.click();
        };

        if (user && (userType === 'staff' || userType === 'admin')) {
            renderPhotoGallery();
        } else if (user && userType === 'student') {
            photoGalleryContent.innerHTML = '<p>Staff or admin only: sign in with a staff or admin account to manage the photo gallery.</p>';
        } else {
            photoGalleryContent.innerHTML = '<p>Please sign in as a staff or admin member to manage the photo gallery.</p>';
        }
    }

    // Handle School News content
    const schoolNewsContent = document.getElementById('school-news-content');
    if (schoolNewsContent) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        function renderSchoolNews() {
            let html = '<h2>School News Management</h2>';
            html += '<div class="news-form-section">';
            html += '<h3>Add New News Article</h3>';
            html += '<form id="news-form">';
            html += '<div class="form-group">';
            html += '<label for="news-title">News Title:</label>';
            html += '<input type="text" id="news-title" placeholder="e.g., School Wins Championship" required>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="news-content">News Content:</label>';
            html += '<textarea id="news-content" placeholder="Write the full news article here..." rows="6" required></textarea>';
            html += '</div>';
            html += '<button type="submit" class="btn-add-news">Add News Article</button>';
            html += '</form>';
            html += '</div>';

            // Current news articles management
            html += '<div class="current-news-section">';
            html += '<h3>Current News Articles</h3>';
            html += '<div id="news-articles-list" class="news-articles-list">';
            html += '</div>';
            html += '</div>';

            schoolNewsContent.innerHTML = html;

            // Load existing news
            loadNewsArticles();

            // Handle news form submission
            const newsForm = document.getElementById('news-form');
            if (newsForm) {
                newsForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const title = document.getElementById('news-title').value.trim();
                    const content = document.getElementById('news-content').value.trim();

                    if (!title || !content) {
                        alert('Please fill in both title and content.');
                        return;
                    }

                    const newsArticles = JSON.parse(localStorage.getItem('schoolNews')) || [];
                    const newArticle = {
                        id: Date.now(),
                        title: title,
                        content: content,
                        date: new Date().toISOString(),
                        author: user
                    };

                    newsArticles.unshift(newArticle); // Add to beginning (most recent first)
                    localStorage.setItem('schoolNews', JSON.stringify(newsArticles));

                    // Reset form
                    newsForm.reset();
                    loadNewsArticles();

                    alert('News article added successfully!');
                });
            }
        }

        function loadNewsArticles() {
            const newsArticles = JSON.parse(localStorage.getItem('schoolNews')) || [];
            const newsList = document.getElementById('news-articles-list');

            if (!newsList) return;

            if (newsArticles.length === 0) {
                newsList.innerHTML = '<p>No news articles published yet.</p>';
                return;
            }

            let html = '';
            newsArticles.forEach(article => {
                const articleDate = new Date(article.date).toLocaleDateString();
                html += '<div class="news-article-item">';
                html += '<div class="news-article-header">';
                html += '<h4>' + article.title + '</h4>';
                html += '<div class="news-article-meta">';
                html += '<small>Published: ' + articleDate + ' by ' + article.author + '</small>';
                html += '<div class="news-article-actions">';
                html += '<button class="btn-edit-news" onclick="editNewsArticle(' + article.id + ')">Edit</button>';
                html += '<button class="btn-delete-news" onclick="deleteNewsArticle(' + article.id + ')">Delete</button>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '<div class="news-article-content">' + article.content.replace(/\n/g, '<br>') + '</div>';
                html += '</div>';
            });

            newsList.innerHTML = html;
        }

        window.deleteNewsArticle = function(articleId) {
            if (confirm('Are you sure you want to delete this news article?')) {
                const newsArticles = JSON.parse(localStorage.getItem('schoolNews')) || [];
                const updatedArticles = newsArticles.filter(a => a.id !== articleId);
                localStorage.setItem('schoolNews', JSON.stringify(updatedArticles));
                loadNewsArticles();
            }
        };

        window.editNewsArticle = function(articleId) {
            const newsArticles = JSON.parse(localStorage.getItem('schoolNews')) || [];
            const article = newsArticles.find(a => a.id === articleId);

            if (!article) return;

            const newTitle = prompt('Edit title:', article.title);
            if (newTitle === null) return;

            const newContent = prompt('Edit content:', article.content);
            if (newContent === null) return;

            article.title = newTitle.trim();
            article.content = newContent.trim();
            article.date = new Date().toISOString(); // Update timestamp

            localStorage.setItem('schoolNews', JSON.stringify(newsArticles));
            loadNewsArticles();
            alert('News article updated successfully!');
        };

        if (user && (userType === 'staff' || userType === 'admin')) {
            renderSchoolNews();
        } else if (user && userType === 'student') {
            schoolNewsContent.innerHTML = '<p>Staff or admin only: sign in with a staff or admin account to manage school news.</p>';
        } else {
            schoolNewsContent.innerHTML = '<p>Please sign in as a staff or admin member to manage school news.</p>';
        }
    }

    // Handle School News content
    const schoolNewsContent = document.getElementById('school-news-content');
    if (schoolNewsContent) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        function renderSchoolNews() {
            let html = '<h2>School News Management</h2>';
            html += '<div class="news-form-section">';
            html += '<h3>Add New News Article</h3>';
            html += '<form id="news-form">';
            html += '<div class="form-group">';
            html += '<label for="news-title">News Title:</label>';
            html += '<input type="text" id="news-title" placeholder="e.g., School Wins Championship" required>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '<label for="news-content">News Content:</label>';
            html += '<textarea id="news-content" placeholder="Write the full news article here..." rows="6" required></textarea>';
            html += '</div>';
            html += '<button type="submit" class="btn-add-news">Add News Article</button>';
            html += '</form>';
            html += '</div>';

            // Current news articles management
            html += '<div class="current-news-section">';
            html += '<h3>Current News Articles</h3>';
            html += '<div id="news-articles-list" class="news-articles-list">';
            html += '</div>';
            html += '</div>';

            schoolNewsContent.innerHTML = html;

            // Load existing news
            loadNewsArticles();

            // Handle news form submission
            const newsForm = document.getElementById('news-form');
            if (newsForm) {
                newsForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const title = document.getElementById('news-title').value.trim();
                    const content = document.getElementById('news-content').value.trim();

                    if (!title || !content) {
                        alert('Please fill in both title and content.');
                        return;
                    }

                    const newsArticles = JSON.parse(localStorage.getItem('schoolNews')) || [];
                    const newArticle = {
                        id: Date.now(),
                        title: title,
                        content: content,
                        date: new Date().toISOString(),
                        author: user
                    };

                    newsArticles.unshift(newArticle); // Add to beginning (most recent first)
                    localStorage.setItem('schoolNews', JSON.stringify(newsArticles));

                    // Reset form
                    newsForm.reset();
                    loadNewsArticles();

                    alert('News article added successfully!');
                });
            }
        }

        function loadNewsArticles() {
            const newsArticles = JSON.parse(localStorage.getItem('schoolNews')) || [];
            const newsList = document.getElementById('news-articles-list');

            if (!newsList) return;

            if (newsArticles.length === 0) {
                newsList.innerHTML = '<p>No news articles published yet.</p>';
                return;
            }

            let html = '';
            newsArticles.forEach(article => {
                const articleDate = new Date(article.date).toLocaleDateString();
                html += '<div class="news-article-item">';
                html += '<div class="news-article-header">';
                html += '<h4>' + article.title + '</h4>';
                html += '<div class="news-article-meta">';
                html += '<small>Published: ' + articleDate + ' by ' + article.author + '</small>';
                html += '<div class="news-article-actions">';
                html += '<button class="btn-edit-news" onclick="editNewsArticle(' + article.id + ')">Edit</button>';
                html += '<button class="btn-delete-news" onclick="deleteNewsArticle(' + article.id + ')">Delete</button>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '<div class="news-article-content">' + article.content.replace(/\n/g, '<br>') + '</div>';
                html += '</div>';
            });

            newsList.innerHTML = html;
        }

        window.deleteNewsArticle = function(articleId) {
            if (confirm('Are you sure you want to delete this news article?')) {
                const newsArticles = JSON.parse(localStorage.getItem('schoolNews')) || [];
                const updatedArticles = newsArticles.filter(a => a.id !== articleId);
                localStorage.setItem('schoolNews', JSON.stringify(updatedArticles));
                loadNewsArticles();
            }
        };

        window.editNewsArticle = function(articleId) {
            const newsArticles = JSON.parse(localStorage.getItem('schoolNews')) || [];
            const article = newsArticles.find(a => a.id === articleId);

            if (!article) return;

            const newTitle = prompt('Edit title:', article.title);
            if (newTitle === null) return;

            const newContent = prompt('Edit content:', article.content);
            if (newContent === null) return;

            article.title = newTitle.trim();
            article.content = newContent.trim();
            article.date = new Date().toISOString(); // Update timestamp

            localStorage.setItem('schoolNews', JSON.stringify(newsArticles));
            loadNewsArticles();
            alert('News article updated successfully!');
        };

        if (user && (userType === 'staff' || userType === 'admin')) {
            renderSchoolNews();
        } else if (user && userType === 'student') {
            schoolNewsContent.innerHTML = '<p>Staff or admin only: sign in with a staff or admin account to manage school news.</p>';
        } else {
            schoolNewsContent.innerHTML = '<p>Please sign in as a staff or admin member to manage school news.</p>';
        }
    }

    const teacherContent = document.getElementById('teacher-content');
    if (teacherContent) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');
        const storedResults = JSON.parse(localStorage.getItem('examResults')) || [];
        let termlyResults = JSON.parse(localStorage.getItem('termlyResults')) || [];
        let resultComments = JSON.parse(localStorage.getItem('resultComments')) || [];

        function getLetterGrade(score) {
            if (score >= 90) return 'A+';
            if (score >= 80) return 'A';
            if (score >= 70) return 'B+';
            if (score >= 60) return 'B';
            if (score >= 50) return 'C';
            if (score >= 40) return 'D';
            return 'F';
        }

        function renderTeacherDashboard() {
            const formHTML = '<h2>Enter Termly Result Booklet Scores</h2>' +
                '<form id="teacher-form">' +
                '<label for="teacher-student">Student Username:</label>' +
                '<input type="text" id="teacher-student" placeholder="student username" required>' +
                '<label for="teacher-class">Class:</label>' +
                '<input type="text" id="teacher-class" placeholder="Class (e.g. SS1)" required>' +
                '<label for="teacher-subject">Subject:</label>' +
                '<input type="text" id="teacher-subject" placeholder="Subject name" required>' +
                '<label for="teacher-term">Term:</label>' +
                '<select id="teacher-term" required>' +
                '<option value="">Choose term</option>' +
                '<option value="Term 1">Term 1</option>' +
                '<option value="Term 2">Term 2</option>' +
                '<option value="Term 3">Term 3</option>' +
                '</select>' +
                '<label for="teacher-session">Session:</label>' +
                '<input type="text" id="teacher-session" placeholder="2025/2026" required>' +
                '<label for="teacher-ca1">1st CA (0-20):</label>' +
                '<input type="number" id="teacher-ca1" min="0" max="20" required>' +
                '<label for="teacher-ca2">2nd CA (0-20):</label>' +
                '<input type="number" id="teacher-ca2" min="0" max="20" required>' +
                '<label for="teacher-midterm">Midterm CA (0-10):</label>' +
                '<input type="number" id="teacher-midterm" min="0" max="10" required>' +
                '<label for="teacher-exam">Exam Score (0-100):</label>' +
                '<input type="number" id="teacher-exam" min="0" max="100" required>' +
                '<button type="submit">Save Termly Result</button>' +
                '</form>' +
                '<p id="teacher-message"></p>';

            let tableHTML = '<h2>Saved Termly Booklet Results</h2>';
            if (termlyResults.length === 0) {
                tableHTML += '<p>No termly booklet results saved yet.</p>';
            } else {
                tableHTML += '<table class="results-table"><thead><tr><th>Student</th><th>Class</th><th>Term</th><th>Session</th><th>Subject</th><th>1CA</th><th>2CA</th><th>Midterm</th><th>Total CA</th><th>Exam</th><th>Total</th><th>Grade</th></tr></thead><tbody>';
                termlyResults.forEach(result => {
                    tableHTML += '<tr>' +
                        '<td>' + result.student + '</td>' +
                        '<td>' + result.className + '</td>' +
                        '<td>' + result.term + '</td>' +
                        '<td>' + result.session + '</td>' +
                        '<td>' + result.subject + '</td>' +
                        '<td>' + result.ca1 + '</td>' +
                        '<td>' + result.ca2 + '</td>' +
                        '<td>' + result.midterm + '</td>' +
                        '<td>' + result.totalCA + '</td>' +
                        '<td>' + result.exam + '</td>' +
                        '<td>' + result.total + '</td>' +
                        '<td>' + result.grade + '</td>' +
                        '</tr>';
                });
                tableHTML += '</tbody></table>';
            }

            const commentsHTML = '<h2>Result Booklet Comments</h2>' +
                '<form id="comment-form">' +
                '<label for="comment-student">Student Username:</label>' +
                '<input type="text" id="comment-student" placeholder="student username" required>' +
                '<label for="comment-term">Term:</label>' +
                '<select id="comment-term" required>' +
                '<option value="">Choose term</option>' +
                '<option value="Term 1">Term 1</option>' +
                '<option value="Term 2">Term 2</option>' +
                '<option value="Term 3">Term 3</option>' +
                '</select>' +
                '<label for="comment-session">Session:</label>' +
                '<input type="text" id="comment-session" placeholder="2025/2026" required>' +
                '<label for="form-master-comment">Form Master Comment:</label>' +
                '<textarea id="form-master-comment" rows="3" placeholder="Write the form master comment here..."></textarea>' +
                '<label for="principal-comment">Principal Comment:</label>' +
                '<textarea id="principal-comment" rows="3" placeholder="Write the principal comment here..."></textarea>' +
                '<label for="other-remarks">Other Remarks / Signature Notes:</label>' +
                '<textarea id="other-remarks" rows="2" placeholder="Additional remarks or signature section notes..."></textarea>' +
                '<button type="submit">Save Comments</button>' +
                '</form>';

            let commentsTableHTML = '<h3>Saved Comments</h3>';
            if (resultComments.length === 0) {
                commentsTableHTML += '<p>No comments saved yet.</p>';
            } else {
                commentsTableHTML += '<table class="results-table"><thead><tr><th>Student</th><th>Term</th><th>Session</th><th>Form Master Comment</th><th>Principal Comment</th></tr></thead><tbody>';
                resultComments.forEach(comment => {
                    commentsTableHTML += '<tr>' +
                        '<td>' + comment.student + '</td>' +
                        '<td>' + comment.term + '</td>' +
                        '<td>' + comment.session + '</td>' +
                        '<td>' + (comment.formMasterComment || '-') + '</td>' +
                        '<td>' + (comment.principalComment || '-') + '</td>' +
                        '</tr>';
                });
                commentsTableHTML += '</tbody></table>';
            }

            teacherContent.innerHTML = formHTML + tableHTML + commentsHTML + commentsTableHTML;

            const teacherForm = document.getElementById('teacher-form');
            if (teacherForm) {
                teacherForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const student = document.getElementById('teacher-student').value.trim();
                    const className = document.getElementById('teacher-class').value.trim();
                    const subject = document.getElementById('teacher-subject').value.trim();
                    const term = document.getElementById('teacher-term').value;
                    const session = document.getElementById('teacher-session').value.trim();
                    const ca1 = Number(document.getElementById('teacher-ca1').value);
                    const ca2 = Number(document.getElementById('teacher-ca2').value);
                    const midterm = Number(document.getElementById('teacher-midterm').value);
                    const exam = Number(document.getElementById('teacher-exam').value);
                    const message = document.getElementById('teacher-message');

                    if (!student || !className || !subject || !term || !session || isNaN(ca1) || isNaN(ca2) || isNaN(midterm) || isNaN(exam)) {
                        message.textContent = 'Please enter all required fields with valid values.';
                        message.style.color = 'red';
                        return;
                    }

                    const totalCA = ca1 + ca2 + midterm;
                    const total = Math.round(totalCA + exam);
                    const grade = getLetterGrade(total);
                    const index = termlyResults.findIndex(r =>
                        r.student === student &&
                        r.subject.toLowerCase() === subject.toLowerCase() &&
                        r.term === term &&
                        r.session === session
                    );

                    const result = {
                        student,
                        className,
                        subject,
                        term,
                        session,
                        ca1,
                        ca2,
                        midterm,
                        totalCA,
                        exam,
                        total,
                        grade,
                        date: new Date().toISOString()
                    };

                    if (index >= 0) {
                        termlyResults[index] = result;
                    } else {
                        termlyResults.push(result);
                    }

                    localStorage.setItem('termlyResults', JSON.stringify(termlyResults));
                    message.textContent = 'Termly result saved for ' + student + ' (' + subject + ').';
                    message.style.color = 'green';
                    renderTeacherDashboard();
                });
            }

            const commentForm = document.getElementById('comment-form');
            if (commentForm) {
                commentForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const student = document.getElementById('comment-student').value.trim();
                    const term = document.getElementById('comment-term').value;
                    const session = document.getElementById('comment-session').value.trim();
                    const formMasterComment = document.getElementById('form-master-comment').value.trim();
                    const principalComment = document.getElementById('principal-comment').value.trim();
                    const otherRemarks = document.getElementById('other-remarks').value.trim();
                    const message = document.getElementById('teacher-message');

                    if (!student || !term || !session) {
                        message.textContent = 'Please enter student, term, and session to save comments.';
                        message.style.color = 'red';
                        return;
                    }

                    const commentIndex = resultComments.findIndex(c =>
                        c.student === student &&
                        c.term === term &&
                        c.session === session
                    );

                    const commentEntry = {
                        student,
                        term,
                        session,
                        formMasterComment,
                        principalComment,
                        otherRemarks,
                        date: new Date().toISOString()
                    };

                    if (commentIndex >= 0) {
                        resultComments[commentIndex] = commentEntry;
                    } else {
                        resultComments.push(commentEntry);
                    }

                    localStorage.setItem('resultComments', JSON.stringify(resultComments));
                    message.textContent = 'Comments saved for ' + student + ' (' + term + ', ' + session + ').';
                    message.style.color = 'green';
                    renderTeacherDashboard();
                });
            }
        }

        if (user && (userType === 'staff' || userType === 'admin')) {
            renderTeacherDashboard();
        } else if (user && userType === 'student') {
            teacherContent.innerHTML = '<p>Staff or admin only: sign in with a staff or admin account to enter scores.</p>';
        } else {
            teacherContent.innerHTML = '<p>Please sign in as a staff or admin member to use the teacher dashboard.</p>';
        }
    }

    // Handle results page
    const resultsContent = document.getElementById('results-content');
    if (resultsContent) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');
        const storedResults = JSON.parse(localStorage.getItem('examResults')) || [];
        const caResults = JSON.parse(localStorage.getItem('caResults')) || [];
        const termlyResults = JSON.parse(localStorage.getItem('termlyResults')) || [];
        const resultComments = JSON.parse(localStorage.getItem('resultComments')) || [];

        function calculateClassPosition(studentName, studentClass, term, session) {
            const classResults = termlyResults.filter(r => r.className === studentClass && r.term === term && r.session === session);
            if (classResults.length === 0) return { position: 0, totalInClass: 0 };

            const totalsByStudent = {};
            classResults.forEach(result => {
                if (!totalsByStudent[result.student]) {
                    totalsByStudent[result.student] = { total: 0, count: 0 };
                }
                totalsByStudent[result.student].total += result.total;
                totalsByStudent[result.student].count += 1;
            });

            const ranking = Object.keys(totalsByStudent)
                .map(student => ({ student, average: totalsByStudent[student].total / totalsByStudent[student].count }))
                .sort((a, b) => b.average - a.average);

            const position = ranking.findIndex(entry => entry.student === studentName) + 1;
            return { position, totalInClass: ranking.length };
        }

        function getLatestTermEntry(results) {
            if (!results.length) return null;
            return results.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        }

        function renderStudentResults(studentName, selectedTerm = '', selectedSession = '', container = resultsContent) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const currentUser = users.find(u => u.username === studentName);
            const studentTermlyResults = termlyResults.filter(r => r.student === studentName);
            const classInfo = currentUser && currentUser.class ? currentUser.class : (studentTermlyResults[0] ? studentTermlyResults[0].className : 'Not assigned');

            let html = '<div class="result-booklet">';
            html += '<div class="result-booklet-header">';
            html += '<h2>GODS ROYAL SCHOOL</h2>';
            html += '<p>Termly Result Booklet</p>';
            html += '</div>';

            if (studentTermlyResults.length === 0) {
                html += '<p>No termly booklet results found yet for <strong>' + studentName + '</strong>. Ask your teacher to enter the scores.</p>';
                html += '</div>';
                container.innerHTML = html;
                return;
            }

            let targetTerm = selectedTerm;
            let targetSession = selectedSession;
            let filteredResults = studentTermlyResults;

            if (targetTerm) {
                filteredResults = filteredResults.filter(r => r.term === targetTerm);
            }
            if (targetSession) {
                filteredResults = filteredResults.filter(r => r.session === targetSession);
            }

            const latestFiltered = getLatestTermEntry(filteredResults);
            if (latestFiltered) {
                targetTerm = latestFiltered.term;
                targetSession = latestFiltered.session;
            } else {
                const latestOverall = getLatestTermEntry(studentTermlyResults);
                if (latestOverall) {
                    targetTerm = latestOverall.term;
                    targetSession = latestOverall.session;
                }
            }

            const resultsForTerm = studentTermlyResults.filter(r => r.term === targetTerm && r.session === targetSession);
            const commentEntry = resultComments.find(c => c.student === studentName && c.term === targetTerm && c.session === targetSession) || {};

            if (resultsForTerm.length === 0) {
                html += '<p>No results found for <strong>' + studentName + '</strong> in ' + (targetTerm || 'the selected term') + ' ' + (targetSession || '') + '.</p>';
                html += '</div>';
                container.innerHTML = html;
                return;
            }

            html += '<div class="student-info">';
            html += '<p><strong>Student Name:</strong> ' + studentName + '</p>';
            html += '<p><strong>Class:</strong> ' + classInfo + '</p>';
            html += '<p><strong>Term:</strong> ' + targetTerm + '</p>';
            html += '<p><strong>Session:</strong> ' + targetSession + '</p>';
            html += '</div>';
            html += '<button class="btn-print-result" onclick="printResultBooklet()">Print Result Booklet</button>';
            html += '<div class="result-table-wrap">';
            html += '<table class="result-booklet-table">';
            html += '<thead><tr><th>Subject</th><th>1st CA</th><th>2nd CA</th><th>Midterm CA</th><th>Total CA</th><th>Exam</th><th>Total</th><th>Grade</th></tr></thead>';
            html += '<tbody>';

            let sumTotal = 0;
            resultsForTerm.forEach(result => {
                html += '<tr>';
                html += '<td>' + result.subject + '</td>';
                html += '<td>' + result.ca1 + '</td>';
                html += '<td>' + result.ca2 + '</td>';
                html += '<td>' + result.midterm + '</td>';
                html += '<td>' + result.totalCA + '</td>';
                html += '<td>' + result.exam + '</td>';
                html += '<td>' + result.total + '</td>';
                html += '<td>' + result.grade + '</td>';
                html += '</tr>';
                sumTotal += result.total;
            });

            html += '</tbody></table>';
            html += '</div>';

            const averageScore = resultsForTerm.length > 0 ? (sumTotal / resultsForTerm.length).toFixed(2) : '0.00';
            const positionData = calculateClassPosition(studentName, classInfo, targetTerm, targetSession);

            html += '<div class="result-summary">';
            html += '<p><strong>Average Score:</strong> ' + averageScore + '</p>';
            html += '<p><strong>Class Position:</strong> ' + (positionData.position > 0 ? positionData.position + ' of ' + positionData.totalInClass : 'N/A') + '</p>';
            html += '<p><strong>Total Subjects:</strong> ' + resultsForTerm.length + '</p>';
            html += '</div>';

            html += '<div class="result-remarks">';
            html += '<h4>Form Master Comment</h4>';
            html += '<p>' + (commentEntry.formMasterComment || '...........................................................') + '</p>';
            html += '<h4>Principal Comment</h4>';
            html += '<p>' + (commentEntry.principalComment || '...........................................................') + '</p>';
            html += '<h4>Other Remarks</h4>';
            html += '<p>' + (commentEntry.otherRemarks || '...........................................................') + '</p>';
            html += '</div>';

            html += '<div class="signature-block">';
            html += '<div><p>__________________________</p><p>Form Teacher Signature</p></div>';
            html += '<div><p>__________________________</p><p>Principal Signature</p></div>';
            html += '<div><p>__________________________</p><p>Parent / Guardian Signature</p></div>';
            html += '</div>';
            html += '</div>';

            container.innerHTML = html;
        }

        window.printResultBooklet = function() {
            window.print();
        };

        if (user && userType === 'student') {
            renderStudentResults(user);
        } else if (user && (userType === 'staff' || userType === 'admin')) {
            const lastStudent = localStorage.getItem('lastPreviewStudent') || '';
            const lastTerm = localStorage.getItem('lastPreviewTerm') || '';
            const lastSession = localStorage.getItem('lastPreviewSession') || '';

            resultsContent.innerHTML = '\n                <div class="teacher-result-preview">\n                    <h2>Teacher Preview: Student Result Booklet</h2>\n                    <div class="preview-form">\n                        <label for="preview-student">Student Username:</label>\n                        <input type="text" id="preview-student" placeholder="Enter student username" value="' + lastStudent + '">\n                        <label for="preview-term">Term (optional):</label>\n                        <select id="preview-term">\n                            <option value="">Latest</option>\n                            <option value="Term 1"' + (lastTerm === 'Term 1' ? ' selected' : '') + '>Term 1</option>\n                            <option value="Term 2"' + (lastTerm === 'Term 2' ? ' selected' : '') + '>Term 2</option>\n                            <option value="Term 3"' + (lastTerm === 'Term 3' ? ' selected' : '') + '>Term 3</option>\n                        </select>\n                        <label for="preview-session">Session (optional):</label>\n                        <input type="text" id="preview-session" placeholder="2025/2026" value="' + lastSession + '">\n                        <button class="btn-print-result" id="preview-button">Preview Student Result</button>\n                    </div>\n                    <div id="preview-results"></div>\n                </div>';
            const previewButton = document.getElementById('preview-button');
            if (previewButton) {
                previewButton.addEventListener('click', function() {
                    const studentName = document.getElementById('preview-student').value.trim();
                    const term = document.getElementById('preview-term').value;
                    const session = document.getElementById('preview-session').value.trim();
                    const previewResults = document.getElementById('preview-results');
                    if (!studentName) {
                        previewResults.innerHTML = '<p>Please enter a student username to preview.</p>';
                        return;
                    }

                    // Save the search parameters
                    localStorage.setItem('lastPreviewStudent', studentName);
                    localStorage.setItem('lastPreviewTerm', term);
                    localStorage.setItem('lastPreviewSession', session);

                    renderStudentResults(studentName, term, session, previewResults);
                });
            }
        } else {
            resultsContent.innerHTML = '<p>Please sign in as a student to view your results.</p>';
        }
    }

    // Handle contact management
    const contactForm = document.getElementById('contact-form');
    const adminPanel = document.querySelector('.admin-panel');
    const adminMessage = document.getElementById('admin-message');
    if (contactForm && adminPanel) {
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        // Only show admin panel if user is logged in as staff
if (user && (userType === 'staff' || userType === 'admin')) {
            adminPanel.style.display = 'block';
            if (adminMessage) adminMessage.style.display = 'none';
        } else {
            adminPanel.style.display = 'none';
            if (adminMessage) {
                adminMessage.style.display = 'block';
                adminMessage.textContent = user ? 'Only staff or admin members can manage contacts.' : 'Please sign in as a staff or admin member to manage contacts.';
            }
            return; // Exit early if not admin
        }

        let contacts = JSON.parse(localStorage.getItem('schoolContacts')) || [
            { name: 'Main Office', phone: '08057335134', email: 'chrisogoko14@gmail.com', address: 'bakussa, Die Die, Abuja 12345' }
        ];

        function renderContacts() {
            // Render contact cards for public display
            const contactsList = document.getElementById('contacts-list');
            if (contactsList) {
                contactsList.innerHTML = contacts.map((contact, index) => `
                    <div class="contact-card">
                        <h3>${contact.name}</h3>
                        <p><strong>Phone:</strong> ${contact.phone}</p>
                        <p><strong>Email:</strong> ${contact.email}</p>
                        <p><strong>Address:</strong> ${contact.address}</p>
                    </div>
                `).join('');
            }

            // Render admin table
            const tbody = document.getElementById('contacts-tbody');
            if (tbody) {
                tbody.innerHTML = contacts.map((contact, index) => `
                    <tr>
                        <td>${contact.name}</td>
                        <td>${contact.phone}</td>
                        <td>${contact.email}</td>
                        <td>${contact.address}</td>
                        <td><button class="btn-delete" onclick="deleteContact(${index})">Remove</button></td>
                    </tr>
                `).join('');
            }
        }

        window.deleteContact = function(index) {
            if (confirm('Are you sure you want to delete this contact?')) {
                contacts.splice(index, 1);
                localStorage.setItem('schoolContacts', JSON.stringify(contacts));
                renderContacts();
            }
        };

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const address = document.getElementById('contact-address').value.trim();

            if (name && phone && email) {
                contacts.push({ name, phone, email, address });
                localStorage.setItem('schoolContacts', JSON.stringify(contacts));
                
                // Reset form
                contactForm.reset();
                
                // Show success message
                const message = document.createElement('p');
                message.textContent = 'Contact added successfully!';
                message.style.color = 'green';
                message.style.marginTop = '1rem';
                contactForm.appendChild(message);
                setTimeout(() => message.remove(), 2000);
                
                renderContacts();
            }
        });

        // Initial render
        renderContacts();

        // Handle school information management
        const schoolInfoForm = document.getElementById('school-info-form');
        if (schoolInfoForm) {
            let schoolInfo = JSON.parse(localStorage.getItem('schoolInfo')) || {
                email: 'chrisogoko14@gmail.com',
                address: 'bakussa, Die Die, Abuja 12345'
            };

            function updateSchoolInfoDisplay() {
                const currentEmail = document.getElementById('current-email');
                const currentAddress = document.getElementById('current-address');
                const schoolEmailInput = document.getElementById('school-email');
                const schoolAddressInput = document.getElementById('school-address');

                if (currentEmail) currentEmail.textContent = schoolInfo.email;
                if (currentAddress) currentAddress.textContent = schoolInfo.address;
                if (schoolEmailInput) schoolEmailInput.value = schoolInfo.email;
                if (schoolAddressInput) schoolAddressInput.value = schoolInfo.address;
            }

            schoolInfoForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const email = document.getElementById('school-email').value.trim();
                const address = document.getElementById('school-address').value.trim();

                if (email && address) {
                    schoolInfo.email = email;
                    schoolInfo.address = address;
                    localStorage.setItem('schoolInfo', JSON.stringify(schoolInfo));

                    // Update the default contact if it exists
                    const defaultContactIndex = contacts.findIndex(c => c.name === 'Main Office');
                    if (defaultContactIndex >= 0) {
                        contacts[defaultContactIndex].email = email;
                        contacts[defaultContactIndex].address = address;
                        localStorage.setItem('schoolContacts', JSON.stringify(contacts));
                        renderContacts();
                    }

                    // Show success message
                    const message = document.createElement('p');
                    message.textContent = 'School information updated successfully!';
                    message.style.color = 'green';
                    message.style.marginTop = '1rem';
                    schoolInfoForm.appendChild(message);
                    setTimeout(() => message.remove(), 2000);

                    updateSchoolInfoDisplay();
                }
            });

            // Initial display update
            updateSchoolInfoDisplay();
        }
    }
});