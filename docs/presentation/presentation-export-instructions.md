# QueueUp - PowerPoint Export Instructions

## 📋 **Converting Markdown to PowerPoint**

Since binary PowerPoint generation isn't available, follow these steps to create the presentation:

### **Method 1: Using Pandoc (Recommended)**

1. **Install Pandoc**
   ```bash
   # Windows (using Chocolatey)
   choco install pandoc
   
   # macOS (using Homebrew)
   brew install pandoc
   
   # Ubuntu/Debian
   sudo apt-get install pandoc
   ```

2. **Convert to PowerPoint**
   ```bash
   pandoc slides.md -o presentation.pptx -t pptx
   ```

3. **Customize in PowerPoint**
   - Apply GCTU branding and colors
   - Add university logo
   - Adjust fonts and spacing
   - Insert demo screenshots

### **Method 2: Using Google Slides**

1. **Create New Presentation**
   - Go to slides.google.com
   - Create new presentation

2. **Copy Content**
   - Copy each slide from `slides.md`
   - Paste into Google Slides
   - Format as needed

3. **Export to PowerPoint**
   - File → Download → Microsoft PowerPoint (.pptx)

### **Method 3: Manual Creation in PowerPoint**

1. **Open PowerPoint**
   - Create new presentation
   - Choose professional template

2. **Create Slides**
   - Use `slides.md` as content guide
   - Follow the 20-slide structure
   - Add speaker notes from `PRESENTATION_NOTES.md`

## 🎨 **Design Guidelines**

### **Color Scheme (GCTU Branding)**
- **Primary Blue**: #007bff
- **Secondary Blue**: #6366f1
- **Success Green**: #22c55e
- **Warning Orange**: #f59e0b
- **Error Red**: #e05656
- **Text Dark**: #1f2937
- **Text Light**: #6b7280

### **Typography**
- **Headers**: Poppins Bold (or similar sans-serif)
- **Body Text**: Poppins Regular
- **Code/Technical**: Consolas or Monaco

### **Layout Standards**
- **Title Slide**: Large title, subtitle, presenter names
- **Content Slides**: Clear hierarchy, bullet points
- **Demo Slides**: Screenshots with callouts
- **Data Slides**: Charts and graphs with clear labels

## 📊 **Required Visual Elements**

### **Slide 7: Architecture Diagram**
Create a visual diagram showing:
```
[Student Dashboard] ←→ [Admin Dashboard] ←→ [Firebase Database]
```
Use boxes, arrows, and icons to illustrate the flow.

### **Slide 6: ROI Chart**
Create a bar chart showing:
- Current Costs: $117,000
- QueueUp Costs: $18,900
- Annual Savings: $88,200

### **Slide 13: Timeline Gantt Chart**
Create a timeline showing:
- Month 1: Development
- Month 2: Pilot
- Month 3: Deployment

### **Slide 5: Demo Screenshots**
Include screenshots of:
- Student dashboard interface
- Complaint submission form
- Admin dashboard with filtering
- Mobile responsive view

## 🎤 **Speaker Notes Integration**

For each slide, add detailed speaker notes from `PRESENTATION_NOTES.md`:

1. **In PowerPoint**: Use the Notes pane below each slide
2. **In Google Slides**: Use the speaker notes section
3. **Include timing**: Add estimated speaking time for each slide

## 📱 **Demo Integration**

### **Slide 5: Product Demo**
- Embed live demo link: `staging.queueup.gctu.edu.gh`
- Include backup screenshots
- Add QR code for mobile access

### **Interactive Elements**
- Clickable links to demo environment
- QR codes for mobile viewing
- Contact information with clickable emails

## 📄 **Export Formats**

### **Primary Deliverables**
1. **presentation.pptx** - Main PowerPoint file
2. **presentation.pdf** - PDF version for sharing
3. **EXECUTIVE_SUMMARY.pdf** - One-page leave-behind

### **Backup Formats**
1. **Google Slides** - Cloud-based backup
2. **Keynote** - macOS compatibility
3. **HTML** - Web-based presentation

## ✅ **Quality Checklist**

### **Content Review**
- [ ] All 20 slides created
- [ ] Speaker notes added to each slide
- [ ] Timing estimates included
- [ ] Demo links tested
- [ ] Contact information accurate

### **Design Review**
- [ ] GCTU branding applied
- [ ] Consistent fonts and colors
- [ ] High-quality images and diagrams
- [ ] Readable text size (minimum 24pt)
- [ ] Professional layout and spacing

### **Technical Review**
- [ ] All links functional
- [ ] Demo environment accessible
- [ ] Backup screenshots included
- [ ] Mobile compatibility tested
- [ ] PDF export successful

## 🚀 **Final Steps**

1. **Test Presentation**
   - Run through entire presentation
   - Test all interactive elements
   - Verify timing estimates

2. **Create Backups**
   - Save multiple file formats
   - Upload to cloud storage
   - Share with team members

3. **Prepare for Demo**
   - Test demo environment
   - Prepare backup procedures
   - Brief all presenters

## 📞 **Support Resources**

### **Design Tools**
- **Canva**: For creating diagrams and charts
- **Figma**: For UI mockups and wireframes
- **PowerPoint Designer**: AI-powered design suggestions

### **Stock Images**
- **Unsplash**: High-quality free images
- **Pexels**: Professional stock photos
- **Icons8**: Icons and illustrations

### **Presentation Tips**
- Keep slides visual and minimal
- Use consistent formatting
- Practice transitions between speakers
- Prepare for technical difficulties

---

*Export Instructions Version: 1.0*
*Last Updated: January 2025*