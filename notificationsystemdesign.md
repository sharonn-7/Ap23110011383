# Notification System Design

## Stage 1: Notification Prioritization

### Objective
Build a system to fetch notifications from a protected API and return the top 10 most important notifications based on priority and recency.

---

### Approach

1. **Fetch Data**
   - Notifications are fetched from the API using a Bearer token.

2. **Assign Priority**
   - Placement = 3  
   - Result = 2  
   - Event = 1  

3. **Compute Score**
   - Each notification is assigned a score:
     ```
     score = (typePriority * BUCKET_SIZE) + timestamp
     ```
   - This ensures type priority dominates, while timestamp ensures recency.

4. **Sort and Select**
   - Notifications are sorted in descending order of score.
   - Top 10 notifications are selected.

---

### Priority Logic
- Placement > Result > Event  
- Within the same type, newer notifications rank higher.

---

### Error Handling
- Handles API errors (e.g., 401 Unauthorized).
- Returns empty list if response is invalid.

---

### Efficient Strategy
To maintain top 10 dynamically:
- Use a **Min Heap (Priority Queue)** of size 10
- Insert new notifications
- Remove lowest priority when size exceeds 10

---

### Output
Displays:
- Rank  
- Type  
- Timestamp  
- Message  

---

## Stage 2: Frontend Application

### Objective
Develop a React application to display notifications with filtering, pagination, priority view, and viewed/unviewed distinction.

---

### Application Overview
- Runs on:  
  `http://localhost:3000`

- Views:
  - All Notifications  
  - Priority Notifications  

---

### Features

#### 1. Fetching Notifications
- Uses API with Bearer token.
- Supports:
  - limit  
  - page  
  - notification_type  

---

#### 2. All Notifications View
- Displays notifications list
- Shows:
  - Type  
  - Message  
  - Timestamp  

- Supports:
  - Filtering by type  
  - Pagination  

---

#### 3. Priority Notifications View
- Displays top 10 notifications
- Uses same logic as Stage 1

---

#### 4. Viewed / Unviewed
- New notifications → highlighted  
- Viewed notifications → muted  
- Clicking marks as viewed  

---

#### 5. Routing
- `/` → All Notifications  
- `/priority` → Priority Notifications  

---

#### 6. UI
- Simple and clean layout  
- Focus on usability and clarity  

---

### Error Handling
- Handles API failures  
- Prevents crashes for invalid data  

---

### Performance
- Pagination reduces load  
- Efficient rendering  
- Priority calculated in-memory  

---

### Conclusion
The system successfully:
- Prioritizes notifications effectively  
- Provides a clean UI  
- Supports filtering and pagination  
- Handles user interaction smoothly  

The design is scalable and suitable for real-world applications.