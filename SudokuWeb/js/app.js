// Mock database
let users = [];

// Show register form
function showRegisterForm() {
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('sudoku-container').style.display = 'none';
    document.getElementById('register-error').innerText = '';
}

// Show login form
function showLoginForm() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('sudoku-container').style.display = 'none';
    document.getElementById('login-error').innerText = '';
}

// Validate password
function validatePassword(password) {
    const minLength = 8;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return 'Password must be at least 8 characters long.';
    }
    if (!uppercase.test(password)) {
        return 'Password must contain at least one uppercase letter.';
    }
    if (!lowercase.test(password)) {
        return 'Password must contain at least one lowercase letter.';
    }
    if (!number.test(password)) {
        return 'Password must contain at least one number.';
    }
    if (!specialChar.test(password)) {
        return 'Password must contain at least one special character.';
    }
    return null;
}

// Register function
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const passwordError = validatePassword(password);
    if (passwordError) {
        document.getElementById('register-error').innerText = passwordError;
        return;
    }

    if (username === '' || password === '') {
        alert('All fields are required.');
        return;
    }

    // Check if username already exists
    if (users.find(user => user.username === username)) {
        document.getElementById('register-error').innerText = 'Username already exists.';
        return;
    }

    // Hash password (simple hash for demonstration purposes)
    const hashedPassword = btoa(password);

    // Save user
    users.push({ username, password: hashedPassword });
    showLoginForm();
}

// Login function
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username === '' || password === '') {
        alert('All fields are required.');
        return;
    }

    // Hash password (simple hash for demonstration purposes)
    const hashedPassword = btoa(password);

    // Check if user exists
    const user = users.find(user => user.username === username && user.password === hashedPassword);
    if (user) {
        showSudokuGrid();
    } else {
        document.getElementById('login-error').innerText = 'Invalid username or password.';
    }
}

// Function to generate a random Sudoku puzzle with difficulty
function generateRandomSudoku(difficulty) {
    const basePuzzle = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    const puzzle = JSON.parse(JSON.stringify(basePuzzle));

    let emptyCells;
    if (difficulty === 'easy') {
        emptyCells = 20;
    } else if (difficulty === 'medium') {
        emptyCells = 40;
    } else {
        emptyCells = 60;
    }

    while (emptyCells > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            emptyCells--;
        }
    }

    return puzzle;
}

// Function to solve the Sudoku puzzle
function solveSudoku(board) {
    const solvedPuzzle = JSON.parse(JSON.stringify(board));
    solveHelper(solvedPuzzle);
    return solvedPuzzle;
}

// Helper function for solving Sudoku recursively
function solveHelper(board) {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) {
        return true; // Puzzle solved
    }

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
        if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveHelper(board)) {
                return true;
            }
            board[row][col] = 0; // Backtrack
        }
    }
    return false; // No valid number found for this cell
}

// Function to find an empty cell in the Sudoku puzzle
function findEmptyCell(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null; // No empty cell found
}

// Function to check if a move is valid
function isValidMove(board, row, col, num) {
    // Check row
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) {
            return false;
        }
    }
    // Check column
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) {
            return false;
        }
    }
    // Check 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) {
                return false;
            }
        }
    }
    return true; // Move is valid
}

// Function to create the Sudoku puzzle grid
function createSudokuGrid(puzzle) {
    const container = document.getElementById("container");
    container.innerHTML = '';
    puzzle.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
            const cellElement = document.createElement('input');
            cellElement.classList.add('cell');
            cellElement.type = 'text';
            cellElement.maxLength = 1;
            cellElement.value = cell !== 0 ? cell : '';

            // Add bold borders to separate 3x3 grids
            if (rowIndex % 3 === 0) {
                cellElement.classList.add('bold-border-top');
            }
            if (columnIndex % 3 === 0) {
                cellElement.classList.add('bold-border-left');
            }
            if (rowIndex === 8) {
                cellElement.classList.add('bold-border-bottom');
            }
            if (columnIndex === 8) {
                cellElement.classList.add('bold-border-right');
            }

            // Add event listener for cell selection
            cellElement.addEventListener('focus', () => {
                highlightCell(rowIndex, columnIndex);
            });

            container.appendChild(cellElement);
        });
    });
}

// Function to highlight the selected cell and its row and column
function highlightCell(rowIndex, columnIndex) {
    // Remove previous highlights
    document.querySelectorAll('.selected-cell').forEach(cell => cell.classList.remove('selected-cell'));
    document.querySelectorAll('.highlighted-cell').forEach(cell => cell.classList.remove('highlighted-cell'));

    // Highlight the selected cell
    const container = document.getElementById("container");
    const selectedCell = container.children[rowIndex * 9 + columnIndex];
    selectedCell.classList.add('selected-cell');

    // Highlight the row and column of the selected cell
    for (let i = 0; i < 9; i++) {
        container.children[rowIndex * 9 + i].classList.add('highlighted-cell');
        container.children[i * 9 + columnIndex].classList.add('highlighted-cell');
    }
}

// Show Sudoku grid after successful login
function showSudokuGrid() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('sudoku-container').style.display = 'block';

    let difficulty = document.getElementById("difficulty").value;
    let initialPuzzle = generateRandomSudoku(difficulty);
    let puzzle = JSON.parse(JSON.stringify(initialPuzzle));
    createSudokuGrid(puzzle);

    // Attach event listeners to buttons
    document.getElementById("solveButton").addEventListener("click", function () {
        let solvedPuzzle = solveSudoku(puzzle);
        createSudokuGrid(solvedPuzzle);
    });
    document.getElementById("resetButton").addEventListener("click", function () {
        difficulty = document.getElementById("difficulty").value;
        initialPuzzle = generateRandomSudoku(difficulty);
        puzzle = JSON.parse(JSON.stringify(initialPuzzle));
        createSudokuGrid(puzzle);
    });
}

// Initial puzzle creation
document.addEventListener("DOMContentLoaded", function () {
    showRegisterForm();
    let difficulty = document.getElementById("difficulty").value;
    let initialPuzzle = generateRandomSudoku(difficulty);
    let puzzle = JSON.parse(JSON.stringify(initialPuzzle));
    createSudokuGrid(puzzle);
});

// Logout function
function logout() {
    document.getElementById('sudoku-container').style.display = 'none';
    showLoginForm();
}
