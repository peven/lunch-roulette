# Default UI/UX Prompt for Claude Design (Lunch Roulette)

You are a senior Product Designer and UX Writer. Propose a polished, pragmatic UI/UX direction for **Lunch Roulette**, an internal web app used by colleagues to decide lunch spots quickly.

Your output should be production-oriented and easy for engineers to implement in a Next.js web app.

---

## 1) Product context
Lunch Roulette helps teammates:
- Share and browse restaurants
- Declare lunch intentions (dine-in vs takeaway)
- Build a shortlist and spin roulette to pick one
- Capture a quick post-lunch rating

Current app status is MVP with basic forms and lists.

---

## 2) Existing pages and current behavior (must respect)

### Home (`/`)
- Minimal landing page with app name + short MVP description.

### Restaurants (`/restaurants`)
- Fetches and displays restaurant list.
- Shows: name, address, eco flags:
  - vegetarian friendly
  - vegan options
  - accepts own bowls

### Lunch Intentions (`/intentions`)
- Form-based flow.
- Inputs:
  - user
  - office
  - restaurant
  - mode (`dine_in` or `takeaway`)
- Submits intention for **today**.
- Displays success/failure message.

### Roulette (`/roulette`)
- User selects office and user.
- Loads restaurants for selected office (distance-aware list when office is selected).
- User manually selects exact shortlist candidates (checkboxes).
- Spin action submits shortlist and returns selected winner.
- Displays shortlist summary, winner, and errors.

---

## 3) Data/API constraints to account for
Design should align with existing backend capabilities:
- `GET /offices`
- `GET /users`
- `GET /restaurants`
- `GET /restaurants?officeId=<id>` (includes distance meters)
- `POST /intentions`
- `POST /roulette/spin`
- `POST /reviews`

Assume authentication is currently local/dev-like and lightweight.

---

## 4) Target users and usage style
- Internal teams, mostly desktop during workdays.
- Frequent repeat use at lunch time.
- Need: very fast decision flow, low cognitive load, clear feedback.

---

## 5) Design goals
1. Reduce time-to-decision (especially in Roulette flow).
2. Make restaurant discovery and eco attributes scannable.
3. Improve trust and clarity around the spin result.
4. Keep form completion friction low for intentions.
5. Prepare UX patterns that can scale beyond MVP without rework.

---

## 6) Deliverables required from you
Provide all of the following sections:

1. **Information architecture**
   - Proposed primary nav and page hierarchy
   - Any page merges/splits you recommend

2. **User flows**
   - Step-by-step flows for:
     - Restaurant browsing
     - Intention submission
     - Roulette shortlist + spin + result confirmation
     - Post-lunch review capture

3. **Per-page UI blueprint**
   For each page (`/`, `/restaurants`, `/intentions`, `/roulette`, and a proposed review surface):
   - layout regions
   - core components
   - states (empty/loading/error/success)
   - key interactions

4. **Component system proposal**
   - Reusable components (cards, chips, selectors, status banners, result modal, etc.)
   - Suggested variants + usage rules

5. **Content and microcopy**
   - Better button labels, helper text, empty states, error messages
   - Tone: friendly, concise, work-appropriate

6. **Accessibility and inclusivity**
   - Keyboard flow expectations
   - Color/contrast guidance
   - Screen reader considerations for forms and roulette result announcement

7. **Responsive behavior**
   - Desktop-first with mobile fallback
   - What changes at smaller breakpoints

8. **Design tokens / visual direction (lightweight)**
   - Spacing, typography scale, semantic colors
   - Priority indicators for eco-friendly signals and distance

9. **Implementation handoff notes for engineers**
   - Suggested incremental rollout plan in 2–3 phases
   - Low-risk quick wins first

10. **Open questions / assumptions**
   - Explicitly list assumptions needing PM/engineering confirmation

---

## 7) Output format constraints
- Use clear Markdown with headings and bullet points.
- Be specific and actionable, not generic.
- Where relevant, map recommendations to current pages and existing API endpoints.
- Separate **MVP-improving-now** ideas from **future enhancements**.

---

## 8) Quality bar
Prioritize practical UX improvements that can be implemented quickly in a real codebase over speculative redesigns.
