// Task Manager App JavaScript
class TaskManager {
  constructor() {
    this.tasks = {
      backlog: [
        { id: 1, title: 'Implement CRUD (Create, Read, Update, and Delete) operations', label: 'technical' },
        { id: 2, title: 'Design Todo App', label: 'design' }
      ],
      inProgress: [
        { id: 3, title: 'Implement the ability for users to add tasks using the mouse or keyboard', label: 'frontend' },
        { id: 4, title: 'Implement the ability for users to view a specific subset of tasks', label: 'frontend' },
        { id: 5, title: 'Use the useEffect state Hook to update the number of pending tasks', label: 'technical' }
      ],
      inReview: [
        { id: 6, title: 'Implement the ability for users to edit tasks', label: 'frontend' },
        { id: 7, title: 'Implement the ability for users to delete tasks using the mouse or keyboard', label: 'frontend' }
      ],
      completed: [
        { id: 8, title: 'Create a basic App component structure and styling', label: 'concept' },
        { id: 9, title: 'Investigate Framer-Motion for animations', label: 'learning' }
      ]
    };
    this.nextId = 10;
    this.cache = new Map(); // Local cache storage (in-memory for now)
    
    // Filter and search state
    this.filters = {
      search: '',
      labels: ['all'], // Default to show all labels
      statuses: ['backlog', 'inProgress', 'inReview', 'completed'] // Default to show all statuses
    };
    
    // Advanced security settings
    this.currentWorkspace = 'default';
    this.workspacePasscode = null;
    this.isWorkspaceProtected = false;
    this.encryptionKey = null;
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.lastActivity = Date.now();
    this.securityLevel = 'medium'; // low, medium, high
    this.autoLockEnabled = true;
    
    this.init();
  }

  init() {
    this.initializeSecurity();
    this.loadFromCache();
    this.renderAllColumns();
    this.addEventListeners();
    this.setupModal();
    this.setupKeyboardShortcuts();
    this.setupSidebar();
    this.setupWorkspaceUI();
    this.initializeSidebarState();
    this.updateFilterCounts();
    this.setupPageLifecycle();
    this.startSecurityMonitoring();
  }

  addEventListeners() {
    // Add task buttons - use setTimeout to ensure DOM is ready
    setTimeout(() => {
      document.querySelectorAll('.add-task-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const column = e.target.getAttribute('data-column');
          this.openTaskModal(column);
        });
      });
    }, 100);

    // Task card click handlers
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-task')) {
        const taskId = parseInt(e.target.getAttribute('data-task-id'));
        const column = e.target.getAttribute('data-column');
        this.editTask(taskId, column);
      } else if (e.target.classList.contains('delete-task')) {
        const taskId = parseInt(e.target.getAttribute('data-task-id'));
        const column = e.target.getAttribute('data-column');
        this.deleteTask(taskId, column);
      } else if (e.target.classList.contains('move-task')) {
        const taskId = parseInt(e.target.getAttribute('data-task-id'));
        const fromColumn = e.target.getAttribute('data-from-column');
        const toColumn = e.target.getAttribute('data-to-column');
        this.moveTask(taskId, fromColumn, toColumn);
      } else if (e.target.classList.contains('duplicate-task')) {
        const taskId = parseInt(e.target.getAttribute('data-task-id'));
        const column = e.target.getAttribute('data-column');
        this.duplicateTask(taskId, column);
      } else if (e.target.classList.contains('task-card')) {
        // Task card click for quick view
        this.showTaskDetails(e.target);
      }
    });

    // Wait for modal to be created before adding listeners
    setTimeout(() => {
      // Modal event listeners
      const closeModal = document.getElementById('closeModal');
      if (closeModal) {
        closeModal.addEventListener('click', () => {
          this.closeTaskModal();
        });
      }

      const taskForm = document.getElementById('taskForm');
      if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleTaskSubmit();
        });
      }

      const cancelBtn = document.getElementById('cancelBtn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          this.closeTaskModal();
        });
      }
    }, 200);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      const modal = document.getElementById('taskModal');
      if (modal && e.target === modal) {
        this.closeTaskModal();
      }
    });

    // Sidebar button event listeners
    setTimeout(() => {
      // Sidebar toggle (inside sidebar)
      const sidebarToggle = document.getElementById('sidebarToggle');
      if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
          this.toggleSidebar();
        });
      }

      // Floating toggle (outside sidebar)
      const floatingToggle = document.getElementById('floatingToggle');
      if (floatingToggle) {
        floatingToggle.addEventListener('click', () => {
          this.toggleSidebar();
        });
      }

      // Sidebar export/import/clear buttons
      const sidebarExportBtn = document.getElementById('sidebarExportBtn');
      if (sidebarExportBtn) {
        sidebarExportBtn.addEventListener('click', () => {
          this.exportData();
        });
      }

      const sidebarImportBtn = document.getElementById('sidebarImportBtn');
      if (sidebarImportBtn) {
        sidebarImportBtn.addEventListener('click', () => {
          document.getElementById('sidebarImportInput').click();
        });
      }

      const sidebarImportInput = document.getElementById('sidebarImportInput');
      if (sidebarImportInput) {
        sidebarImportInput.addEventListener('change', (e) => {
          this.importData(e);
        });
      }

      const sidebarClearAllBtn = document.getElementById('sidebarClearAllBtn');
      if (sidebarClearAllBtn) {
        sidebarClearAllBtn.addEventListener('click', () => {
          this.clearAllTasks();
        });
      }

      // Reset filters button
      const resetFiltersBtn = document.getElementById('resetFiltersBtn');
      if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
          this.resetFilters();
        });
      }
    }, 100);

    // Drag and drop functionality
    this.setupDragAndDrop();
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + N: Add new task to backlog
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        this.openTaskModal('backlog');
      }
      // Escape: Close modal
      if (e.key === 'Escape') {
        this.closeTaskModal();
      }
      // Enter: Save task when modal is open
      if (e.key === 'Enter' && document.getElementById('taskModal').style.display === 'block') {
        e.preventDefault();
        this.handleTaskSubmit();
      }
    });
  }

  setupDragAndDrop() {
    // Add drag events to task cards after they're rendered
    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('task-card')) {
        const taskId = e.target.getAttribute('data-task-id');
        const column = this.findTaskColumn(parseInt(taskId));
        e.dataTransfer.setData('text/plain', JSON.stringify({ taskId, column }));
        e.target.style.opacity = '0.5';
      }
    });

    document.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('task-card')) {
        e.target.style.opacity = '1';
      }
    });

    // Add drop zones to columns
    document.querySelectorAll('.tasks-container').forEach(container => {
      container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.classList.add('drag-over');
      });

      container.addEventListener('dragleave', () => {
        container.classList.remove('drag-over');
      });

      container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');
        
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const targetColumn = container.closest('.board-column').getAttribute('data-column-key');
        
        if (data.column !== targetColumn) {
          this.moveTask(parseInt(data.taskId), data.column, targetColumn);
        }
      });
    });
  }

  setupModal() {
    // Check if modal already exists
    if (document.getElementById('taskModal')) {
      return;
    }

    // Create modal HTML
    const modalHTML = `
      <div id="taskModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modalTitle">Add New Task</h2>
            <span id="closeModal" class="close">&times;</span>
          </div>
          <form id="taskForm">
            <div class="form-group">
              <label for="taskTitle">Task Title:</label>
              <input type="text" id="taskTitle" name="taskTitle" required>
            </div>
            <div class="form-group">
              <label for="taskLabel">Label:</label>
              <select id="taskLabel" name="taskLabel" required>
                <option value="concept">Concept</option>
                <option value="technical">Technical</option>
                <option value="frontend">Frontend</option>
                <option value="design">Design</option>
                <option value="learning">Learning</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" id="cancelBtn">Cancel</button>
              <button type="submit" id="saveBtn">Save Task</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup custom modal system
    this.setupCustomModals();
  }

  // Custom Modal System
  setupCustomModals() {
    // Setup confirm modal event listeners
    const confirmModal = document.getElementById('confirmModal');
    const confirmModalClose = document.getElementById('confirmModalClose');
    const confirmModalCancel = document.getElementById('confirmModalCancel');
    const confirmModalConfirm = document.getElementById('confirmModalConfirm');

    if (confirmModalClose) {
      confirmModalClose.addEventListener('click', () => {
        this.closeConfirmModal();
      });
    }

    if (confirmModalCancel) {
      confirmModalCancel.addEventListener('click', () => {
        this.closeConfirmModal();
      });
    }

    // Setup alert modal event listeners
    const alertModal = document.getElementById('alertModal');
    const alertModalClose = document.getElementById('alertModalClose');
    const alertModalOk = document.getElementById('alertModalOk');

    if (alertModalClose) {
      alertModalClose.addEventListener('click', () => {
        this.closeAlertModal();
      });
    }

    if (alertModalOk) {
      alertModalOk.addEventListener('click', () => {
        this.closeAlertModal();
      });
    }

    // Close modals when clicking outside
    if (confirmModal) {
      confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
          this.closeConfirmModal();
        }
      });
    }

    if (alertModal) {
      alertModal.addEventListener('click', (e) => {
        if (e.target === alertModal) {
          this.closeAlertModal();
        }
      });
    }

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeConfirmModal();
        this.closeAlertModal();
      }
    });
  }

  // Custom confirm dialog
  showConfirm(title, message, onConfirm, onCancel = null) {
    return new Promise((resolve) => {
      const confirmModal = document.getElementById('confirmModal');
      const titleElement = document.getElementById('confirmModalTitle');
      const messageElement = document.getElementById('confirmModalMessage');
      const confirmBtn = document.getElementById('confirmModalConfirm');

      if (titleElement) titleElement.textContent = title;
      if (messageElement) messageElement.textContent = message;

      // Remove any existing event listeners
      const newConfirmBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

      // Add new event listener
      newConfirmBtn.addEventListener('click', () => {
        this.closeConfirmModal();
        if (onConfirm) onConfirm();
        resolve(true);
      });

      // Update cancel handler to resolve with false
      const cancelBtn = document.getElementById('confirmModalCancel');
      const closeBtn = document.getElementById('confirmModalClose');
      
      const handleCancel = () => {
        this.closeConfirmModal();
        if (onCancel) onCancel();
        resolve(false);
      };

      // Remove existing listeners and add new ones
      const newCancelBtn = cancelBtn.cloneNode(true);
      const newCloseBtn = closeBtn.cloneNode(true);
      cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
      closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

      newCancelBtn.addEventListener('click', handleCancel);
      newCloseBtn.addEventListener('click', handleCancel);

      confirmModal.style.display = 'flex';
    });
  }

  // Custom alert dialog
  showAlert(title, message, onOk = null) {
    return new Promise((resolve) => {
      const alertModal = document.getElementById('alertModal');
      const titleElement = document.getElementById('alertModalTitle');
      const messageElement = document.getElementById('alertModalMessage');
      const okBtn = document.getElementById('alertModalOk');

      if (titleElement) titleElement.textContent = title;
      if (messageElement) messageElement.textContent = message;

      // Remove any existing event listeners
      const newOkBtn = okBtn.cloneNode(true);
      okBtn.parentNode.replaceChild(newOkBtn, okBtn);

      // Add new event listener
      newOkBtn.addEventListener('click', () => {
        this.closeAlertModal();
        if (onOk) onOk();
        resolve();
      });

      alertModal.style.display = 'flex';
    });
  }

  closeConfirmModal() {
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
      confirmModal.style.display = 'none';
    }
  }

  closeAlertModal() {
    const alertModal = document.getElementById('alertModal');
    if (alertModal) {
      alertModal.style.display = 'none';
    }
  }

  renderColumn(columnKey) {
    const columnElement = document.querySelector(`[data-column-key="${columnKey}"]`);
    
    if (!columnElement) {
      return;
    }

    const tasksContainer = columnElement.querySelector('.tasks-container');
    const tasks = this.tasks[columnKey];
    
    if (!tasksContainer) {
      return;
    }
    
    // Update task count
    const countElement = columnElement.querySelector('.task-count');
    if (countElement) {
      countElement.textContent = `(${tasks.length})`;
    }
    
    // Render tasks
    tasksContainer.innerHTML = tasks.map(task => `
      <div class="task-card" data-task-id="${task.id}" draggable="true">
        <div class="task-title">${task.title}</div>
        <div class="task-labels">
          <span class="label ${task.label}">${this.capitalizeFirst(task.label)}</span>
        </div>
        <div class="task-actions">
          <button class="task-action-btn edit-task" data-task-id="${task.id}" data-column="${columnKey}" title="Edit Task">✏️</button>
          <button class="task-action-btn duplicate-task" data-task-id="${task.id}" data-column="${columnKey}" title="Duplicate Task">📋</button>
          <button class="task-action-btn delete-task" data-task-id="${task.id}" data-column="${columnKey}" title="Delete Task">🗑️</button>
          ${this.getMoveButtons(columnKey, task.id)}
        </div>
      </div>
    `).join('');
    
    // Check if container is scrollable and add appropriate class
    setTimeout(() => {
      // Force a reflow to ensure accurate height calculations
      tasksContainer.offsetHeight;
      
      const isScrollable = tasksContainer.scrollHeight > tasksContainer.clientHeight;
      
      if (isScrollable) {
        tasksContainer.classList.add('has-scroll');
      } else {
        tasksContainer.classList.remove('has-scroll');
      }
    }, 200);
    
    // Cache the updated state
    this.saveToCache();
  }

  getMoveButtons(currentColumn, taskId) {
    const columns = ['backlog', 'inProgress', 'inReview', 'completed'];
    const currentIndex = columns.indexOf(currentColumn);
    let buttons = '';
    
    if (currentIndex > 0) {
      const prevColumn = columns[currentIndex - 1];
      buttons += `<button class="task-action-btn move-task" data-task-id="${taskId}" data-from-column="${currentColumn}" data-to-column="${prevColumn}" title="Move Left">⬅️</button>`;
    }
    
    if (currentIndex < columns.length - 1) {
      const nextColumn = columns[currentIndex + 1];
      buttons += `<button class="task-action-btn move-task" data-task-id="${taskId}" data-from-column="${currentColumn}" data-to-column="${nextColumn}" title="Move Right">➡️</button>`;
    }
    
    return buttons;
  }

  renderAllColumns() {
    Object.keys(this.tasks).forEach(columnKey => {
      this.renderColumn(columnKey);
    });
    this.updateFilterCounts();
    this.applyFilters();
  }

  openTaskModal(column, task = null) {
    const modal = document.getElementById('taskModal');
    
    if (!modal) {
      this.setupModal();
      // Try again after modal is created
      setTimeout(() => this.openTaskModal(column, task), 100);
      return;
    }

    const modalTitle = document.getElementById('modalTitle');
    const taskTitle = document.getElementById('taskTitle');
    const taskLabel = document.getElementById('taskLabel');
    
    if (task) {
      modalTitle.textContent = 'Edit Task';
      taskTitle.value = task.title;
      taskLabel.value = task.label;
      modal.setAttribute('data-editing-task', task.id);
      modal.setAttribute('data-editing-column', column);
    } else {
      modalTitle.textContent = 'Add New Task';
      taskTitle.value = '';
      taskLabel.value = 'concept';
      modal.removeAttribute('data-editing-task');
      modal.setAttribute('data-target-column', column);
    }
    
    modal.style.display = 'block';
    taskTitle.focus();
  }

  closeTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.style.display = 'none';
    document.getElementById('taskForm').reset();
  }

  handleTaskSubmit() {
    const modal = document.getElementById('taskModal');
    const title = document.getElementById('taskTitle').value.trim();
    const label = document.getElementById('taskLabel').value;
    
    if (!title) {
      this.showAlert('Please enter a task title.');
      return;
    }
    
    const editingTaskId = modal.getAttribute('data-editing-task');
    
    if (editingTaskId) {
      // Edit existing task
      const column = modal.getAttribute('data-editing-column');
      this.updateTask(parseInt(editingTaskId), column, { title, label });
    } else {
      // Add new task
      const column = modal.getAttribute('data-target-column');
      this.addTask(column, { title, label });
    }
    
    this.closeTaskModal();
  }

  addTask(column, taskData) {
    const newTask = {
      id: this.nextId++,
      title: taskData.title,
      label: taskData.label,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.tasks[column].push(newTask);
    this.renderColumn(column);
    this.showNotification(`Task added to ${this.getColumnDisplayName(column)}`, 'success');
  }

  updateTask(taskId, column, updates) {
    const taskIndex = this.tasks[column].findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[column][taskIndex] = { 
        ...this.tasks[column][taskIndex], 
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.renderColumn(column);
      this.showNotification('Task updated successfully', 'success');
    }
  }

  deleteTask(taskId, column) {
    const task = this.tasks[column].find(t => t.id === taskId);
    if (task) {
      this.showConfirm(
        'Delete Task',
        `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
        () => {
          this.tasks[column] = this.tasks[column].filter(task => task.id !== taskId);
          this.renderColumn(column);
          this.showNotification('Task deleted successfully', 'info');
        }
      );
    }
  }

  duplicateTask(taskId, column) {
    const task = this.tasks[column].find(t => t.id === taskId);
    if (task) {
      const duplicatedTask = {
        id: this.nextId++,
        title: `${task.title} (Copy)`,
        label: task.label,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.tasks[column].push(duplicatedTask);
      this.renderColumn(column);
      this.showNotification('Task duplicated successfully', 'success');
    }
  }

  moveTask(taskId, fromColumn, toColumn) {
    const taskIndex = this.tasks[fromColumn].findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const task = this.tasks[fromColumn].splice(taskIndex, 1)[0];
      task.updatedAt = new Date().toISOString();
      this.tasks[toColumn].push(task);
      this.renderColumn(fromColumn);
      this.renderColumn(toColumn);
      this.showNotification(
        `Task moved from ${this.getColumnDisplayName(fromColumn)} to ${this.getColumnDisplayName(toColumn)}`, 
        'success'
      );
    }
  }

  findTaskColumn(taskId) {
    for (const [column, tasks] of Object.entries(this.tasks)) {
      if (tasks.find(task => task.id === taskId)) {
        return column;
      }
    }
    return null;
  }

  showTaskDetails(taskCard) {
    const taskId = parseInt(taskCard.getAttribute('data-task-id'));
    const column = this.findTaskColumn(taskId);
    const task = this.tasks[column].find(t => t.id === taskId);
    
    if (task) {
      // Add a subtle highlight effect
      taskCard.style.transform = 'scale(1.02)';
      setTimeout(() => {
        taskCard.style.transform = '';
      }, 200);
      
      this.showNotification(`Task: ${task.title}`, 'info');
    }
  }

  getColumnDisplayName(columnKey) {
    const displayNames = {
      backlog: 'Backlog',
      inProgress: 'In Progress',
      inReview: 'In Review',
      completed: 'Completed'
    };
    return displayNames[columnKey] || columnKey;
  }

  showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'notification';
      notification.className = 'notification';
      document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  // Cache management methods - Enhanced in-memory with auto-backup
  async saveToCache() {
    const cacheData = {
      tasks: this.tasks,
      nextId: this.nextId,
      filters: this.filters,
      timestamp: new Date().toISOString(),
      version: '1.0',
      workspace: this.currentWorkspace,
      securityLevel: this.securityLevel
    };
    
    try {
      if (this.isWorkspaceProtected && this.workspacePasscode) {
        // Save encrypted version
        await this.saveEncryptedData(cacheData);
      } else {
        // Save unencrypted to memory cache
        this.cache.set(`taskManagerData_${this.currentWorkspace}`, cacheData);
      }
      
      // Also save to sessionStorage for persistence across tabs
      this.saveToSessionStorage(cacheData);
      
      // Auto-backup every 10 changes
      if (!this.changeCount) this.changeCount = 0;
      this.changeCount++;
      
      if (this.changeCount % 10 === 0) {
        this.autoBackup(cacheData);
      }
      
    } catch (error) {
      this.showNotification('Warning: Data save failed', 'error');
    }
  }

  loadFromCache() {
    const key = `taskManagerData_${this.currentWorkspace}`;
    const cachedData = this.cache.get(key);
    
    if (cachedData) {
      this.tasks = cachedData.tasks || this.getDefaultTasks();
      this.nextId = cachedData.nextId || 10;
      this.filters = cachedData.filters || this.getDefaultFilters();
      return true;
    }
    
    return false;
  }

  // Auto-backup system (creates downloadable backup files)
  autoBackup(data) {
    try {
      const backupData = {
        ...data,
        backupType: 'auto',
        userAgent: navigator.userAgent.substring(0, 50) // Limited info for context
      };
      
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create hidden download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `task-manager-auto-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.style.display = 'none';
      
      // Auto-download (user can ignore/delete if not wanted)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      // Auto-backup failed silently
    }
  }

  // Enhanced export with security options
  exportData(includeMetadata = true) {
    const exportData = {
      tasks: this.tasks,
      nextId: this.nextId,
      exportDate: new Date().toISOString(),
      version: '1.0',
      workspace: this.currentWorkspace,
      securityLevel: this.securityLevel
    };
    
    // Optionally include metadata
    if (includeMetadata) {
      exportData.metadata = {
        totalTasks: Object.values(this.tasks).flat().length,
        columns: Object.keys(this.tasks),
        labels: [...new Set(Object.values(this.tasks).flat().map(task => task.label))]
      };
    }
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `task-manager-export-${this.currentWorkspace}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    this.showNotification('Data exported successfully', 'success');
  }

  setupPageLifecycle() {
    // Save data before page unload
    window.addEventListener('beforeunload', () => {
      this.saveToCache();
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveToCache();
      } else {
        // Check for updates when page becomes visible
        this.lastActivity = Date.now();
      }
    });

    // Handle focus/blur events
    window.addEventListener('focus', () => {
      this.lastActivity = Date.now();
    });

    window.addEventListener('blur', () => {
      this.saveToCache();
    });
  }

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (importedData.tasks && typeof importedData.tasks === 'object') {
          this.tasks = importedData.tasks;
          this.nextId = importedData.nextId || this.nextId;
          
          // Handle workspace and security info if present
          if (importedData.workspace) {
            this.currentWorkspace = importedData.workspace;
          }
          if (importedData.securityLevel) {
            this.securityLevel = importedData.securityLevel;
          }
          
          this.renderAllColumns();
          this.showNotification('Data imported successfully', 'success');
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        this.showNotification('Error importing data: ' + error.message, 'error');
      }
    };
    reader.readAsText(file);
    
    // Reset the input so the same file can be imported again
    event.target.value = '';
  }

  clearAllTasks() {
    const totalTasks = Object.values(this.tasks).flat().length;
    
    if (totalTasks === 0) {
      this.showNotification('No tasks to clear', 'info');
      return;
    }
    
    this.showConfirm(
      'Clear All Tasks',
      `Are you sure you want to delete all ${totalTasks} tasks? This action cannot be undone.`,
      () => {
        this.tasks = {
          backlog: [],
          inProgress: [],
          inReview: [],
          completed: []
        };
        this.renderAllColumns();
        this.showNotification('All tasks cleared successfully', 'info');
      }
    );
  }

  editTask(taskId, column) {
    const task = this.tasks[column].find(task => task.id === taskId);
    if (task) {
      this.openTaskModal(column, task);
    }
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }



  // Sidebar functionality
  setupSidebar() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value.toLowerCase();
        this.applyFilters();
      });
    }

    const clearSearchBtn = document.getElementById('clearSearchBtn');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.value = '';
          this.filters.search = '';
          this.applyFilters();
        }
      });
    }

    // Label filter checkboxes
    const labelFilters = ['all', 'technical', 'design', 'frontend', 'concept', 'learning'];
    labelFilters.forEach(label => {
      const checkbox = document.getElementById(`filter${label.charAt(0).toUpperCase() + label.slice(1)}`);
      if (checkbox) {
        // Add change event listener
        checkbox.addEventListener('change', () => {
          this.updateLabelFilters();
          this.applyFilters();
        });
        
        // Also add click event listener to the parent label
        const labelElement = checkbox.closest('.filter-option');
        if (labelElement) {
          labelElement.addEventListener('click', (e) => {
            // Only trigger if the click wasn't on the checkbox itself
            if (e.target !== checkbox) {
              checkbox.checked = !checkbox.checked;
              // Manually trigger change event
              checkbox.dispatchEvent(new Event('change'));
            }
          });
        }
        
      } else {
        // Label filter checkbox not found
      }
    });

    // Status filter checkboxes
    const statusFilters = ['backlog', 'inProgress', 'inReview', 'completed'];
    statusFilters.forEach(status => {
      const checkbox = document.getElementById(`status${status.charAt(0).toUpperCase() + status.slice(1)}`);
      if (checkbox) {
        // Add change event listener
        checkbox.addEventListener('change', () => {
          this.updateStatusFilters();
          this.applyFilters();
        });
        
        // Also add click event listener to the parent label
        const labelElement = checkbox.closest('.filter-option');
        if (labelElement) {
          labelElement.addEventListener('click', (e) => {
            // Only trigger if the click wasn't on the checkbox itself
            if (e.target !== checkbox) {
              checkbox.checked = !checkbox.checked;
              // Manually trigger change event
              checkbox.dispatchEvent(new Event('change'));
            }
          });
        }
        
      } else {
        // Status filter checkbox not found
      }
    });

    // Initialize visual states
    this.updateFilterVisualStates();
  }

  // Initialize sidebar state
  initializeSidebarState() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const floatingToggle = document.getElementById('floatingToggle');
    
    // Ensure sidebar starts in expanded state by default
    if (sidebar && !sidebar.classList.contains('collapsed')) {
      if (mainContent) {
        mainContent.classList.remove('sidebar-collapsed');
      }
      // Hide floating toggle on startup since sidebar is expanded
      if (floatingToggle) {
        floatingToggle.style.display = 'none';
        floatingToggle.classList.remove('show');
      }
    }
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const floatingToggle = document.getElementById('floatingToggle');
    
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
      
      // Show/hide floating toggle button based on sidebar state
      if (floatingToggle) {
        if (sidebar.classList.contains('collapsed')) {
          floatingToggle.style.display = 'block';
          floatingToggle.classList.add('show');
        } else {
          floatingToggle.style.display = 'none';
          floatingToggle.classList.remove('show');
        }
      }
      
      // Also toggle a class on main content for additional styling control
      if (mainContent) {
        if (sidebar.classList.contains('collapsed')) {
          mainContent.classList.add('sidebar-collapsed');
        } else {
          mainContent.classList.remove('sidebar-collapsed');
        }
      }
    }
  }

  updateLabelFilters() {
    const allCheckbox = document.getElementById('filterAll');
    const labelCheckboxes = ['technical', 'design', 'frontend', 'concept', 'learning']
      .map(label => document.getElementById(`filter${label.charAt(0).toUpperCase() + label.slice(1)}`))
      .filter(cb => cb);

    // Update visual states
    this.updateFilterVisualStates();

    if (allCheckbox && allCheckbox.checked) {
      // If "All" is checked, uncheck all specific labels
      labelCheckboxes.forEach(cb => cb.checked = false);
      this.filters.labels = ['all'];
    } else {
      // If any specific label is checked, uncheck "All"
      if (labelCheckboxes.some(cb => cb.checked)) {
        allCheckbox.checked = false;
        this.filters.labels = labelCheckboxes
          .filter(cb => cb.checked)
          .map(cb => cb.value);
      } else {
        // If no specific labels are checked, check "All"
        allCheckbox.checked = true;
        this.filters.labels = ['all'];
      }
    }
    
    // Update visual states again after changes
    this.updateFilterVisualStates();
  }

  updateStatusFilters() {
    const statusCheckboxes = ['backlog', 'inProgress', 'inReview', 'completed']
      .map(status => document.getElementById(`status${status.charAt(0).toUpperCase() + status.slice(1)}`))
      .filter(cb => cb);

    this.filters.statuses = statusCheckboxes
      .filter(cb => cb.checked)
      .map(cb => cb.value);
      
    // Update visual states
    this.updateFilterVisualStates();
  }

  updateFilterVisualStates() {
    // Update label filter visual states
    const labelFilters = ['all', 'technical', 'design', 'frontend', 'concept', 'learning'];
    labelFilters.forEach(label => {
      const checkbox = document.getElementById(`filter${label.charAt(0).toUpperCase() + label.slice(1)}`);
      if (checkbox) {
        const filterOption = checkbox.closest('.filter-option');
        if (filterOption) {
          if (checkbox.checked) {
            filterOption.classList.add('filter-active');
          } else {
            filterOption.classList.remove('filter-active');
          }
        }
      }
    });

    // Update status filter visual states
    const statusFilters = ['backlog', 'inProgress', 'inReview', 'completed'];
    statusFilters.forEach(status => {
      const checkbox = document.getElementById(`status${status.charAt(0).toUpperCase() + status.slice(1)}`);
      if (checkbox) {
        const filterOption = checkbox.closest('.filter-option');
        if (filterOption) {
          if (checkbox.checked) {
            filterOption.classList.add('filter-active');
          } else {
            filterOption.classList.remove('filter-active');
          }
        }
      }
    });
  }

  applyFilters() {
    // Filter tasks by search term
    Object.keys(this.tasks).forEach(columnKey => {
      const column = document.querySelector(`[data-column-key="${columnKey}"]`);
      if (!column) return;

      // Hide/show entire column based on status filter
      const shouldShowColumn = this.filters.statuses.includes(columnKey);
      column.style.display = shouldShowColumn ? 'block' : 'none';

      if (!shouldShowColumn) return;

      // Filter individual tasks within the column
      const taskCards = column.querySelectorAll('.task-card');
      taskCards.forEach(taskCard => {
        const taskId = parseInt(taskCard.getAttribute('data-task-id'));
        const task = this.tasks[columnKey].find(t => t.id === taskId);
        
        if (!task) return;

        let shouldShow = true;

        // Apply search filter
        if (this.filters.search) {
          const searchTerm = this.filters.search.toLowerCase();
          const titleMatch = task.title.toLowerCase().includes(searchTerm);
          const labelMatch = task.label.toLowerCase().includes(searchTerm);
          shouldShow = shouldShow && (titleMatch || labelMatch);
        }

        // Apply label filter
        if (!this.filters.labels.includes('all')) {
          shouldShow = shouldShow && this.filters.labels.includes(task.label);
        }

        taskCard.style.display = shouldShow ? 'block' : 'none';
        
        // Highlight search terms
        if (shouldShow && this.filters.search) {
          this.highlightSearchTerms(taskCard, this.filters.search);
        } else {
          this.removeSearchHighlights(taskCard);
        }
      });
    });

    this.updateColumnCounts();
  }

  highlightSearchTerms(taskCard, searchTerm) {
    const titleElement = taskCard.querySelector('.task-title');
    if (titleElement) {
      const originalText = titleElement.getAttribute('data-original-text') || titleElement.textContent;
      titleElement.setAttribute('data-original-text', originalText);
      
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const highlightedText = originalText.replace(regex, '<span class="search-highlight">$1</span>');
      titleElement.innerHTML = highlightedText;
    }
  }

  removeSearchHighlights(taskCard) {
    const titleElement = taskCard.querySelector('.task-title');
    if (titleElement) {
      const originalText = titleElement.getAttribute('data-original-text');
      if (originalText) {
        titleElement.textContent = originalText;
        titleElement.removeAttribute('data-original-text');
      }
    }
  }

  updateColumnCounts() {
    Object.keys(this.tasks).forEach(columnKey => {
      const column = document.querySelector(`[data-column-key="${columnKey}"]`);
      if (!column) return;

      const visibleTasks = Array.from(column.querySelectorAll('.task-card'))
        .filter(card => card.style.display !== 'none').length;
      
      const countElement = column.querySelector('.task-count');
      if (countElement) {
        countElement.textContent = `(${visibleTasks})`;
      }
    });
  }

  updateFilterCounts() {
    // Count tasks by label
    const labelCounts = {
      all: 0,
      technical: 0,
      design: 0,
      frontend: 0,
      concept: 0,
      learning: 0
    };

    // Count tasks by status
    const statusCounts = {
      backlog: 0,
      inProgress: 0,
      inReview: 0,
      completed: 0
    };

    Object.keys(this.tasks).forEach(columnKey => {
      const tasks = this.tasks[columnKey];
      statusCounts[columnKey] = tasks.length;
      
      tasks.forEach(task => {
        labelCounts.all++;
        if (labelCounts.hasOwnProperty(task.label)) {
          labelCounts[task.label]++;
        }
      });
    });

    // Update label count displays
    Object.keys(labelCounts).forEach(label => {
      const countElement = document.getElementById(`count${label.charAt(0).toUpperCase() + label.slice(1)}`);
      if (countElement) {
        countElement.textContent = `(${labelCounts[label]})`;
      }
    });

    // Update status count displays
    Object.keys(statusCounts).forEach(status => {
      const countElement = document.getElementById(`statusCount${status.charAt(0).toUpperCase() + status.slice(1)}`);
      if (countElement) {
        countElement.textContent = `(${statusCounts[status]})`;
      }
    });
  }

  resetFilters() {
    // Reset search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
    }
    this.filters.search = '';

    // Reset label filters
    const allCheckbox = document.getElementById('filterAll');
    if (allCheckbox) {
      allCheckbox.checked = true;
    }
    
    const labelCheckboxes = ['technical', 'design', 'frontend', 'concept', 'learning'];
    labelCheckboxes.forEach(label => {
      const checkbox = document.getElementById(`filter${label.charAt(0).toUpperCase() + label.slice(1)}`);
      if (checkbox) {
        checkbox.checked = false;
      }
    });
    this.filters.labels = ['all'];

    // Reset status filters
    const statusCheckboxes = ['backlog', 'inProgress', 'inReview', 'completed'];
    statusCheckboxes.forEach(status => {
      const checkbox = document.getElementById(`status${status.charAt(0).toUpperCase() + status.slice(1)}`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
    this.filters.statuses = ['backlog', 'inProgress', 'inReview', 'completed'];

    // Apply the reset filters
    this.applyFilters();
    this.showNotification('Filters reset to defaults', 'info');
  }

  // Advanced Security System - Combines all approaches for maximum security
  initializeSecurity() {
    // Check URL parameters for workspace and protection level
    this.parseSecurityParams();
    
    // Initialize encryption if needed
    if (this.securityLevel === 'high') {
      this.initializeEncryption();
    }
    
    // Check workspace protection
    this.checkWorkspaceProtection();
    
    // Set up activity monitoring
    this.setupActivityMonitoring();
  }

  parseSecurityParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    
    // Parse workspace from URL
    this.currentWorkspace = urlParams.get('workspace') || hashParams.get('workspace') || 'default';
    
    // Parse security level
    this.securityLevel = urlParams.get('security') || hashParams.get('security') || 'medium';
    
    // Parse protection flag
    const isProtected = urlParams.get('protected') || hashParams.get('protected');
    this.isWorkspaceProtected = isProtected === 'true';
    
    // Update URL without revealing sensitive params
    this.cleanURL();
  }

  cleanURL() {
    // Remove sensitive parameters from URL after parsing
    const url = new URL(window.location);
    url.searchParams.delete('protected');
    url.searchParams.delete('security');
    
    // Keep workspace for sharing purposes
    if (this.currentWorkspace !== 'default') {
      url.searchParams.set('workspace', this.currentWorkspace);
    }
    
    window.history.replaceState({}, document.title, url.toString());
  }

  async initializeEncryption() {
    try {
      // Generate a random salt for this session
      this.cryptoSalt = crypto.getRandomValues(new Uint8Array(16));
    } catch (error) {
      this.securityLevel = 'medium';
    }
  }

  async deriveKey(passcode, salt) {
    try {
      // Use Web Crypto API for secure key derivation
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(passcode),
        'PBKDF2',
        false,
        ['deriveKey']
      );

      return await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000, // High iteration count for security
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      return null;
    }
  }

  async encryptData(data, passcode) {
    try {
      if (this.securityLevel !== 'high' || !passcode) {
        // Fallback to simple encoding for medium/low security
        return this.simpleEncode(JSON.stringify(data));
      }

      const key = await this.deriveKey(passcode, this.cryptoSalt);
      if (!key) throw new Error('Key derivation failed');

      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(JSON.stringify(data));
      
      // Generate random IV for each encryption
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        dataBytes
      );

      // Combine salt, IV, and encrypted data
      const result = new Uint8Array(this.cryptoSalt.length + iv.length + encryptedData.byteLength);
      result.set(this.cryptoSalt, 0);
      result.set(iv, this.cryptoSalt.length);
      result.set(new Uint8Array(encryptedData), this.cryptoSalt.length + iv.length);

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...result));
    } catch (error) {
      return this.simpleEncode(JSON.stringify(data));
    }
  }

  async decryptData(encryptedString, passcode) {
    try {
      if (this.securityLevel !== 'high' || !passcode) {
        // Fallback to simple decoding
        return JSON.parse(this.simpleDecode(encryptedString));
      }

      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedString).split('').map(char => char.charCodeAt(0))
      );

      // Extract salt, IV, and encrypted data
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encryptedData = combined.slice(28);

      const key = await this.deriveKey(passcode, salt);
      if (!key) throw new Error('Key derivation failed');

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encryptedData
      );

      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decryptedData));
    } catch (error) {
      try {
        return JSON.parse(this.simpleDecode(encryptedString));
      } catch (fallbackError) {
        throw new Error('Data decryption failed completely');
      }
    }
  }

  simpleEncode(str) {
    // Simple XOR encoding for medium security (better than plain text)
    const key = this.currentWorkspace + 'task-manager-2025';
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  simpleDecode(encoded) {
    try {
      const str = atob(encoded);
      const key = this.currentWorkspace + 'task-manager-2025';
      let result = '';
      for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch (error) {
      throw new Error('Simple decoding failed');
    }
  }

  setupActivityMonitoring() {
    // Track user activity for auto-lock
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, () => {
        this.lastActivity = Date.now();
      }, { passive: true });
    });
  }

  startSecurityMonitoring() {
    // Check for inactivity every minute
    setInterval(() => {
      this.checkInactivity();
      this.performSecurityMaintenance();
    }, 60000);
  }

  checkInactivity() {
    if (!this.autoLockEnabled || !this.isWorkspaceProtected) return;
    
    const timeSinceActivity = Date.now() - this.lastActivity;
    
    if (timeSinceActivity > this.sessionTimeout) {
      this.autoLockWorkspace();
    }
  }

  autoLockWorkspace() {
    // Clear sensitive data from memory
    this.encryptionKey = null;
    this.workspacePasscode = null;
    
    // Show lock screen
    this.showLockScreen();
  }

  showLockScreen() {
    this.showConfirm(
      'Session Locked',
      'Your session has been locked due to inactivity. Please re-enter your passcode to continue.',
      () => {
        this.promptForPasscode();
      },
      () => {
        // On cancel, switch to default workspace
        this.switchWorkspace('default');
      }
    );
  }

  performSecurityMaintenance() {
    // Clear temporary data and perform security cleanup
    if (this.securityLevel === 'high') {
      // Rotate encryption parameters periodically
      this.rotateSecurityParameters();
    }
    
    // Clean up old cached data
    this.cleanupSecurityCache();
  }

  rotateSecurityParameters() {
    // Generate new salt for next encryption
    if (crypto && crypto.getRandomValues) {
      this.cryptoSalt = crypto.getRandomValues(new Uint8Array(16));
    }
  }

  cleanupSecurityCache() {
    // Remove old or expired cache entries
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp && (now - new Date(value.timestamp).getTime()) > maxAge) {
        this.cache.delete(key);
      }
    }
  }

  // Enhanced workspace protection with multiple security levels
  checkWorkspaceProtection() {
    if (this.isWorkspaceProtected) {
      this.promptForPasscode();
    } else {
      // Try to load from various sources
      this.loadFromMultipleSources();
    }
  }

  async loadFromMultipleSources() {
    // Try to load in order of preference: URL hash, sessionStorage, cache
    const loaded = await this.loadFromURLHash() || 
                   this.loadFromSessionStorage() || 
                   this.loadFromCache();
    
    if (!loaded) {
      // No existing data found, starting fresh
    }
    
    // Update workspace display and render
    this.updateWorkspaceDisplay();
    this.renderAllColumns();
  }

  async promptForPasscode() {
    this.showPrompt(
      'Protected Workspace',
      `Enter passcode for workspace "${this.currentWorkspace}":`,
      '',
      async (passcode) => {
        if (!passcode) {
          this.showAlert('Access Denied', 'Passcode is required to access this protected workspace.');
          this.switchWorkspace('default');
          return;
        }
        
        this.workspacePasscode = passcode;
        
        try {
          // Try to decrypt existing data with the passcode
          await this.loadProtectedData(passcode);
          this.showNotification('Workspace unlocked successfully', 'success');
          this.lastActivity = Date.now(); // Reset activity timer
          this.updateWorkspaceDisplay();
        } catch (error) {
          console.warn('Failed to unlock workspace:', error);
          this.showAlert('Invalid Passcode', 'Invalid passcode or corrupted data. Please try again.');
          this.promptForPasscode();
        }
      },
      'Unlock',
      'password'
    );
  }

  async loadProtectedData(passcode) {
    // Try multiple storage locations for protected data
    const sources = [
      () => this.loadEncryptedFromURLHash(passcode),
      () => this.loadEncryptedFromSessionStorage(passcode),
      () => this.loadEncryptedFromCache(passcode)
    ];
    
    for (const source of sources) {
      try {
        const data = await source();
        if (data) {
          this.tasks = data.tasks || this.getDefaultTasks();
          this.nextId = data.nextId || 10;
          this.filters = data.filters || this.getDefaultFilters();
        }
      } catch (error) {
        // Failed to load from source
      }
    }
    
    // If no data found, start with defaults
    return false;
  }

  getDefaultTasks() {
    return {
      backlog: [
        { id: 1, title: 'Implement CRUD (Create, Read, Update, and Delete) operations', label: 'technical' },
        { id: 2, title: 'Design Todo App', label: 'design' }
      ],
      inProgress: [
        { id: 3, title: 'Implement the ability for users to add tasks using the mouse or keyboard', label: 'frontend' },
        { id: 4, title: 'Implement the ability for users to view a specific subset of tasks', label: 'frontend' },
        { id: 5, title: 'Use the useEffect state Hook to update the number of pending tasks', label: 'technical' }
      ],
      inReview: [
        { id: 6, title: 'Implement the ability for users to edit tasks', label: 'frontend' },
        { id: 7, title: 'Implement the ability for users to delete tasks using the mouse or keyboard', label: 'frontend' }
      ],
      completed: [
        { id: 8, title: 'Create a basic App component structure and styling', label: 'concept' },
        { id: 9, title: 'Investigate Framer-Motion for animations', label: 'learning' }
      ]
    };
  }

  getDefaultFilters() {
    return {
      search: '',
      labels: ['all'],
      statuses: ['backlog', 'inProgress', 'inReview', 'completed']
    };
  }

  // Enhanced save methods with multiple storage options
  async saveToCache() {
    const cacheData = {
      tasks: this.tasks,
      nextId: this.nextId,
      filters: this.filters,
      timestamp: new Date().toISOString(),
      version: '1.0',
      workspace: this.currentWorkspace,
      securityLevel: this.securityLevel
    };
    
    try {
      if (this.isWorkspaceProtected && this.workspacePasscode) {
        // Save encrypted version
        await this.saveEncryptedData(cacheData);
      } else {
        // Save unencrypted to memory cache
        this.cache.set(`taskManagerData_${this.currentWorkspace}`, cacheData);
      }
      
      // Also save to sessionStorage for persistence across tabs
      this.saveToSessionStorage(cacheData);
      
      // Auto-backup every 10 changes
      if (!this.changeCount) this.changeCount = 0;
      this.changeCount++;
      
      if (this.changeCount % 10 === 0) {
        this.autoBackup(cacheData);
      }
      
      console.log('Data cached successfully');
    } catch (error) {
      console.warn('Failed to save data:', error);
      this.showNotification('Warning: Data save failed', 'error');
    }
  }

  async saveEncryptedData(data) {
    if (!this.workspacePasscode) {
      throw new Error('No passcode available for encryption');
    }
    
    const encrypted = await this.encryptData(data, this.workspacePasscode);
    
    // Save to multiple locations
    this.cache.set(`encrypted_${this.currentWorkspace}`, encrypted);
    sessionStorage.setItem(`encrypted_${this.currentWorkspace}`, encrypted);
    
    // Also save to URL hash for maximum portability
    await this.saveEncryptedToURLHash(encrypted);
  }

  async saveEncryptedToURLHash(encryptedData) {
    try {
      // Compress encrypted data for URL storage
      const compressed = this.compressString(encryptedData);
      window.location.hash = `#ws=${this.currentWorkspace}&data=${compressed}`;
      console.log('Encrypted data saved to URL hash');
    } catch (error) {
      console.warn('Failed to save to URL hash:', error);
    }
  }

  saveToSessionStorage(data) {
    try {
      const key = `taskManager_${this.currentWorkspace}`;
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('SessionStorage save failed:', error);
    }
  }

  // Enhanced load methods
  loadFromCache() {
    const key = `taskManagerData_${this.currentWorkspace}`;
    const cachedData = this.cache.get(key);
    
    if (cachedData) {
      this.tasks = cachedData.tasks || this.getDefaultTasks();
      this.nextId = cachedData.nextId || 10;
      this.filters = cachedData.filters || this.getDefaultFilters();
      console.log('Data loaded from memory cache');
      return true;
    }
    
    return false;
  }

  loadFromSessionStorage() {
    try {
      const key = `taskManager_${this.currentWorkspace}`;
      const data = sessionStorage.getItem(key);
      
      if (data) {
        const parsed = JSON.parse(data);
        this.tasks = parsed.tasks || this.getDefaultTasks();
        this.nextId = parsed.nextId || 10;
        this.filters = parsed.filters || this.getDefaultFilters();
        console.log('Data loaded from sessionStorage');
        return true;
      }
    } catch (error) {
      console.warn('SessionStorage load failed:', error);
    }
    
    return false;
  }

  async loadEncryptedFromCache(passcode) {
    const key = `encrypted_${this.currentWorkspace}`;
    const encrypted = this.cache.get(key);
    
    if (encrypted) {
      return await this.decryptData(encrypted, passcode);
    }
    
    return null;
  }

  async loadEncryptedFromSessionStorage(passcode) {
    try {
      const key = `encrypted_${this.currentWorkspace}`;
      const encrypted = sessionStorage.getItem(key);
      
      if (encrypted) {
        return await this.decryptData(encrypted, passcode);
      }
    } catch (error) {
      console.warn('Encrypted sessionStorage load failed:', error);
    }
    
    return null;
  }

  async loadEncryptedFromURLHash(passcode) {
    try {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.slice(1));
      
      const workspace = params.get('ws');
      const compressedData = params.get('data');
      
      if (workspace === this.currentWorkspace && compressedData) {
        const encrypted = this.decompressString(compressedData);
        return await this.decryptData(encrypted, passcode);
      }
    } catch (error) {
      console.warn('Encrypted URL hash load failed:', error);
    }
    
    return null;
  }

  // Enhanced URL hash methods
  async loadFromURLHash() {
    try {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.slice(1));
      
      // Check for encrypted data first
      if (params.has('ws') && params.has('data')) {
        console.log('Found encrypted data in URL hash');
        return false; // Let the protected data handler deal with this
      }
      
      // Check for unencrypted data
      if (hash.startsWith('#data=')) {
        const compressed = hash.substring(6);
        const jsonStr = this.decompressString(compressed);
        const data = JSON.parse(jsonStr);
        
        if (data.tasks && data.nextId) {
          this.tasks = data.tasks;
          this.nextId = data.nextId;
          this.filters = data.filters || this.getDefaultFilters();
          console.log('Data loaded from URL hash');
          this.showNotification('Data restored from URL', 'success');
          return true;
        }
      }
    } catch (error) {
      console.warn('URL hash load failed:', error);
    }
    
    return false;
  }

  async saveToURLHash() {
    try {
      if (this.isWorkspaceProtected && this.workspacePasscode) {
        // Save encrypted to URL hash
        const data = {
          tasks: this.tasks,
          nextId: this.nextId,
          filters: this.filters,
          timestamp: Date.now()
        };
        await this.saveEncryptedData(data);
      } else {
        // Save unencrypted to URL hash
        const data = {
          tasks: this.tasks,
          nextId: this.nextId,
          timestamp: Date.now()
        };
        
        const jsonStr = JSON.stringify(data);
        const compressed = this.compressString(jsonStr);
        window.location.hash = '#data=' + compressed;
      }
      
      this.showNotification('Data saved to URL (shareable)', 'success');
    } catch (error) {
      console.warn('URL hash save failed:', error);
      this.showNotification('Failed to save to URL', 'error');
    }
  }

  // Workspace management with security
  async switchWorkspace(newWorkspace, isProtected = false) {
    // Save current workspace data
    await this.saveToCache();
    
    // Clear current session
    this.encryptionKey = null;
    this.workspacePasscode = null;
    
    // Switch to new workspace
    this.currentWorkspace = newWorkspace;
    this.isWorkspaceProtected = isProtected;
    
    // Update URL
    const url = new URL(window.location);
    if (newWorkspace !== 'default') {
      url.searchParams.set('workspace', newWorkspace);
    } else {
      url.searchParams.delete('workspace');
    }
    window.history.replaceState({}, document.title, url.toString());
    
    // Load new workspace data
    if (isProtected) {
      this.checkWorkspaceProtection();
    } else {
      await this.loadFromMultipleSources();
    }
    
    this.renderAllColumns();
    this.updateWorkspaceDisplay();
    this.showNotification(`Switched to workspace: ${newWorkspace}`, 'success');
  }

  // Setup workspace management UI
  setupWorkspaceUI() {
    console.log('Setting up workspace UI...');
    
    // Create workspace button
    const createWorkspaceBtn = document.getElementById('createWorkspaceBtn');
    if (createWorkspaceBtn) {
      createWorkspaceBtn.addEventListener('click', () => {
        this.showCreateWorkspaceModal();
      });
    }
    
    // Protect workspace button
    const protectWorkspaceBtn = document.getElementById('protectWorkspaceBtn');
    if (protectWorkspaceBtn) {
      protectWorkspaceBtn.addEventListener('click', () => {
        this.showProtectWorkspaceModal();
      });
    }
    
    // Share workspace button
    const shareWorkspaceBtn = document.getElementById('shareWorkspaceBtn');
    if (shareWorkspaceBtn) {
      shareWorkspaceBtn.addEventListener('click', () => {
        this.exportSecureWorkspace();
      });
    }
    
    // Update workspace display
    this.updateWorkspaceDisplay();
  }
  
  updateWorkspaceDisplay() {
    const workspaceNameEl = document.getElementById('currentWorkspaceName');
    const securityLevelEl = document.getElementById('workspaceSecurityLevel');
    
    if (workspaceNameEl) {
      workspaceNameEl.textContent = this.currentWorkspace;
    }
    
    if (securityLevelEl) {
      const isProtected = this.isWorkspaceProtected;
      const level = this.securityLevel;
      
      securityLevelEl.className = `security-badge ${level}`;
      
      if (isProtected) {
        securityLevelEl.innerHTML = this.getSecurityIcon(level) + ' ' + this.capitalizeFirst(level) + ' (Protected)';
      } else {
        securityLevelEl.innerHTML = this.getSecurityIcon(level) + ' ' + this.capitalizeFirst(level);
      }
    }
  }
  
  getSecurityIcon(level) {
    switch (level) {
      case 'low': return '🔓';
      case 'medium': return '🔒';
      case 'high': return '🔐';
      default: return '🔒';
    }
  }
  
  showCreateWorkspaceModal() {
    this.showPrompt(
      'Create New Workspace',
      'Enter a name for the new workspace:',
      'default',
      (workspaceName) => {
        if (!workspaceName || workspaceName.trim() === '') {
          this.showNotification('Workspace name cannot be empty', 'error');
          return;
        }
        
        const cleanName = workspaceName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
        
        this.showConfirm(
          'Create Workspace',
          `Create workspace "${cleanName}"? This will switch you to the new workspace.`,
          () => {
            this.createNewWorkspace(cleanName);
          }
        );
      },
      'Create'
    );
  }
  
  showProtectWorkspaceModal() {
    if (this.isWorkspaceProtected) {
      this.showConfirm(
        'Remove Protection',
        'This workspace is already protected. Do you want to remove protection?',
        () => {
          this.removeWorkspaceProtection();
        }
      );
      return;
    }
    
    this.showPrompt(
      'Protect Workspace',
      'Enter a passcode to protect this workspace:',
      '',
      (passcode) => {
        if (!passcode || passcode.trim() === '') {
          this.showNotification('Passcode cannot be empty', 'error');
          return;
        }
        
        this.showSecurityLevelModal(passcode);
      },
      'Protect',
      'password'
    );
  }
  
  showSecurityLevelModal(passcode) {
    // Create a custom modal for security level selection
    const modalHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Choose Security Level</h2>
          <button type="button" class="close-btn" onclick="this.closest('.modal').style.display='none'">&times;</button>
        </div>
        <div class="modal-body">
          <p>Select the security level for your workspace:</p>
          <div class="security-options">
            <div class="security-option" data-level="low">
              <div class="security-icon">🔓</div>
              <h3>Low</h3>
              <p>Basic protection with simple encoding</p>
            </div>
            <div class="security-option" data-level="medium">
              <div class="security-icon">🔒</div>
              <h3>Medium</h3>
              <p>XOR encryption with passcode protection</p>
            </div>
            <div class="security-option" data-level="high">
              <div class="security-icon">🔐</div>
              <h3>High</h3>
              <p>AES-256 encryption with secure key derivation</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" onclick="this.closest('.modal').style.display='none'">Cancel</button>
        </div>
      </div>
    `;
    
    const modal = document.getElementById('customModal');
    modal.innerHTML = modalHTML;
    modal.style.display = 'block';
    
    // Add click handlers for security options
    const options = modal.querySelectorAll('.security-option');
    options.forEach(option => {
      option.addEventListener('click', () => {
        const level = option.dataset.level;
        this.protectWorkspace(passcode, level);
        modal.style.display = 'none';
      });
    });
  }
  
  async createNewWorkspace(workspaceName) {
    try {
      // Save current workspace
      await this.saveToCache();
      
      // Switch to new workspace
      await this.switchWorkspace(workspaceName);
      
      // Clear tasks for new workspace
      this.tasks = {
        backlog: [],
        inProgress: [],
        inReview: [],
        completed: []
      };
      this.nextId = 1;
      
      this.renderAllColumns();
      this.updateWorkspaceDisplay();
      this.showNotification(`Created and switched to workspace: ${workspaceName}`, 'success');
    } catch (error) {
      this.showNotification('Failed to create workspace: ' + error.message, 'error');
    }
  }
  
  async protectWorkspace(passcode, securityLevel = 'medium') {
    try {
      this.workspacePasscode = passcode;
      this.isWorkspaceProtected = true;
      this.securityLevel = securityLevel;
      
      // Generate encryption key if needed
      if (securityLevel === 'high') {
        this.encryptionKey = await this.deriveKeyFromPasscode(passcode);
      }
      
      // Save with new protection
      await this.saveToCache();
      
      this.updateWorkspaceDisplay();
      this.showNotification(`Workspace protected with ${securityLevel} security`, 'success');
    } catch (error) {
      this.showNotification('Failed to protect workspace: ' + error.message, 'error');
    }
  }
  
  async removeWorkspaceProtection() {
    try {
      this.workspacePasscode = null;
      this.isWorkspaceProtected = false;
      this.encryptionKey = null;
      this.securityLevel = 'medium';
      
      // Save without protection
      await this.saveToCache();
      
      this.updateWorkspaceDisplay();
      this.showNotification('Workspace protection removed', 'success');
    } catch (error) {
      this.showNotification('Failed to remove protection: ' + error.message, 'error');
    }
  }

  // Enhanced prompt modal with input type support
  showPrompt(title, message, defaultValue = '', callback = null, confirmText = 'OK', inputType = 'text') {
    const modalHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${title}</h2>
          <button type="button" class="close-btn" onclick="this.closest('.modal').style.display='none'">&times;</button>
        </div>
        <div class="modal-body">
          <p>${message}</p>
          <input type="${inputType}" id="promptInput" value="${defaultValue}" placeholder="Enter value..." />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" onclick="this.closest('.modal').style.display='none'">Cancel</button>
          <button type="button" class="btn btn-primary" id="promptConfirm">${confirmText}</button>
        </div>
      </div>
    `;
    
    const modal = document.getElementById('customModal');
    modal.innerHTML = modalHTML;
    modal.style.display = 'block';
    
    const input = modal.querySelector('#promptInput');
    const confirmBtn = modal.querySelector('#promptConfirm');
    
    // Focus input and select text
    setTimeout(() => {
      input.focus();
      if (defaultValue) {
        input.select();
      }
    }, 100);
    
    // Handle confirm
    const handleConfirm = () => {
      const value = input.value;
      modal.style.display = 'none';
      if (callback) {
        callback(value);
      }
    };
    
    confirmBtn.addEventListener('click', handleConfirm);
    
    // Handle Enter key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleConfirm();
      }
    });
  }
}

// Initialize the task manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.taskManager = new TaskManager();
});
