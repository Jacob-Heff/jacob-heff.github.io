// Man Hour Counter - Time Tracking Application
// Professional time tracking with local storage

class TimeTracker {
    constructor() {
        this.startTime = null;
        this.pausedTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.currentSession = null;
        this.timerInterval = null;
        
        if (this.initializeElements()) {
            this.bindEvents();
            this.loadStoredData();
            this.updateDisplay();
        } else {
            console.error('Failed to initialize Time Tracker');
        }
    }
    
    initializeElements() {
        this.timerDisplay = document.getElementById('timerDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.projectSelect = document.getElementById('projectSelect');
        this.taskInput = document.getElementById('taskInput');
        this.timeLogsContainer = document.getElementById('timeLogs');
        this.todayTotalEl = document.getElementById('todayTotal');
        this.todaySessionsEl = document.getElementById('todaySessions');
        this.avgSessionEl = document.getElementById('avgSession');
        this.projectStatsEl = document.getElementById('projectStats');
        
        // Error checking
        if (!this.timerDisplay || !this.startBtn || !this.pauseBtn || !this.stopBtn) {
            console.error('Required timer elements not found');
            return false;
        }
        return true;
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.stopBtn.addEventListener('click', () => this.stopTimer());
    }
    
    startTimer() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.pausedTime;
            this.isRunning = true;
            this.isPaused = false;
            
            this.currentSession = {
                project: this.projectSelect.value,
                task: this.taskInput.value || 'Untitled Task',
                startTime: new Date(),
                duration: 0
            };
            
            this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        }
        
        this.updateButtonStates();
    }
    
    pauseTimer() {
        if (this.isRunning && !this.isPaused) {
            this.isPaused = true;
            this.pausedTime = Date.now() - this.startTime;
            clearInterval(this.timerInterval);
        } else if (this.isPaused) {
            this.isPaused = false;
            this.startTime = Date.now() - this.pausedTime;
            this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        }
        
        this.updateButtonStates();
    }
    
    stopTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = false;
            clearInterval(this.timerInterval);
            
            const finalDuration = Date.now() - this.startTime;
            this.currentSession.duration = finalDuration;
            this.currentSession.endTime = new Date();
            
            this.saveSession(this.currentSession);
            this.resetTimer();
        }
        
        this.updateButtonStates();
        this.updateDisplay();
    }
    
    updateTimer() {
        if (this.isRunning && !this.isPaused) {
            const elapsed = Date.now() - this.startTime;
            this.timerDisplay.textContent = this.formatTime(elapsed);
        }
    }
    
    resetTimer() {
        this.startTime = null;
        this.pausedTime = 0;
        this.currentSession = null;
        this.timerDisplay.textContent = '00:00:00';
    }
    
    updateButtonStates() {
        if (!this.isRunning) {
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.stopBtn.disabled = true;
            this.startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        } else if (this.isPaused) {
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.stopBtn.disabled = false;
            this.pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        } else {
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.stopBtn.disabled = false;
            this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    }
    
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    saveSession(session) {
        const sessions = this.getStoredSessions();
        sessions.push(session);
        localStorage.setItem('timeTrackerSessions', JSON.stringify(sessions));
    }
    
    getStoredSessions() {
        const stored = localStorage.getItem('timeTrackerSessions');
        return stored ? JSON.parse(stored) : [];
    }
    
    loadStoredData() {
        const sessions = this.getStoredSessions();
        this.displayRecentLogs(sessions);
        this.updateStats(sessions);
    }
    
    displayRecentLogs(sessions) {
        const recent = sessions.slice(-10).reverse();
        
        if (recent.length === 0) {
            this.timeLogsContainer.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Start tracking time to see your logs here!
                </div>
            `;
            return;
        }
        
        const logsHtml = recent.map(session => `
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                    <strong>${session.task}</strong><br>
                    <small class="text-muted">
                        <i class="fas fa-folder"></i> ${this.getProjectName(session.project)} • 
                        <i class="fas fa-calendar"></i> ${new Date(session.startTime).toLocaleDateString()} • 
                        <i class="fas fa-clock"></i> ${new Date(session.startTime).toLocaleTimeString()}
                    </small>
                </div>
                <div>
                    <span class="badge bg-primary">${this.formatTime(session.duration)}</span>
                </div>
            </div>
        `).join('');
        
        this.timeLogsContainer.innerHTML = logsHtml;
    }
    
    updateStats(sessions) {
        const today = new Date().toDateString();
        const todaySessions = sessions.filter(s => new Date(s.startTime).toDateString() === today);
        
        const totalTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
        const sessionCount = todaySessions.length;
        const avgSession = sessionCount > 0 ? totalTime / sessionCount : 0;
        
        this.todayTotalEl.textContent = this.formatDuration(totalTime);
        this.todaySessionsEl.textContent = sessionCount;
        this.avgSessionEl.textContent = this.formatDuration(avgSession);
        
        this.updateProjectStats(todaySessions);
    }
    
    updateProjectStats(sessions) {
        const projectTotals = {};
        
        sessions.forEach(session => {
            const project = session.project;
            projectTotals[project] = (projectTotals[project] || 0) + session.duration;
        });
        
        if (Object.keys(projectTotals).length === 0) {
            this.projectStatsEl.innerHTML = `
                <div class="text-muted text-center py-3">
                    <i class="fas fa-chart-pie fa-2x mb-2"></i><br>
                    Start tracking to see project breakdown
                </div>
            `;
            return;
        }
        
        const totalTime = Object.values(projectTotals).reduce((sum, time) => sum + time, 0);
        
        const statsHtml = Object.entries(projectTotals)
            .sort(([,a], [,b]) => b - a)
            .map(([project, time]) => {
                const percentage = Math.round((time / totalTime) * 100);
                return `
                    <div class="mb-2">
                        <div class="d-flex justify-content-between">
                            <span>${this.getProjectName(project)}</span>
                            <span>${percentage}%</span>
                        </div>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }).join('');
        
        this.projectStatsEl.innerHTML = statsHtml;
    }
    
    getProjectName(projectValue) {
        const projectNames = {
            'general': 'General Work',
            'web-dev': 'Web Development',
            'mobile-dev': 'Mobile Development',
            'research': 'Research & Learning',
            'meetings': 'Meetings'
        };
        return projectNames[projectValue] || projectValue;
    }
    
    formatDuration(milliseconds) {
        const totalMinutes = Math.floor(milliseconds / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
    
    updateDisplay() {
        this.loadStoredData();
    }
}

// Global functions for export and clear
function exportData() {
    const sessions = JSON.parse(localStorage.getItem('timeTrackerSessions') || '[]');
    
    if (sessions.length === 0) {
        alert('No data to export!');
        return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Date,Start Time,End Time,Project,Task,Duration (minutes)\n"
        + sessions.map(session => [
            new Date(session.startTime).toLocaleDateString(),
            new Date(session.startTime).toLocaleTimeString(),
            new Date(session.endTime).toLocaleTimeString(),
            session.project,
            `"${session.task}"`,
            Math.round(session.duration / (1000 * 60))
        ].join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `time-tracker-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearData() {
    if (confirm('Are you sure you want to clear all time tracking data? This action cannot be undone.')) {
        localStorage.removeItem('timeTrackerSessions');
        window.timeTracker.updateDisplay();
        alert('All data has been cleared!');
    }
}

// Initialize the time tracker when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.timeTracker = new TimeTracker();
});
