# Stage 1: Notification Prioritization System

## Objective

The goal of this stage is to design a system that fetches notifications from a protected API and returns the top N (default 10) most important notifications based on type priority and recency.

---

## Approach

1. **Fetch Notifications**
   - Notifications are retrieved from the given API using a Bearer access token.
   - Proper error handling is implemented to manage failed API responses.

2. **Assign Type Priority**
   Each notification type is assigned a priority value:
   - Placement = 3
   - Result = 2
   - Event = 1

3. **Compute Priority Score**
   A combined score is calculated using both type priority and timestamp:
   