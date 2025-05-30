     primary: "#16A34A",     // disaster-green-600
      secondary: "#10B981",   // disaster-mint-500  
      accent: "#0F4C81",      // Deep blue
      text: "#1F2937",        // Dark gray
      lightGray: "#6B7280",   // Medium gray
      background: "#F9FAFB",  // Light gray background
      white: "#FFFFFF",
      danger: "#DC2626",      // Red for high risk
      warning: "#F59E0B",     // Orange for medium risk
      success: "#10B981"      // Green for low risk
    };

    // Helper function to add section headers
    function addSectionHeader(title: string, y: number) {
      doc.fontSize(18)
         .fillColor(colors.primary)
         .font('Helvetica-Bold')
         .text(title, 40, y, { width: 515 });
      return y + 30;
    }

    // Helper function to add divider lines
    function addDivider(y: number) {
      doc.strokeColor(colors.lightGray)
         .lineWidth(1)
         .moveTo(40, y)
         .lineTo(555, y)
         .stroke();
      return y + 20;
    }

    // --- COVER PAGE ---
    doc.font('Helvetica-Bold')
       .fontSize(36)
       .fillColor(colors.primary)
       .text("Disaster Dodger™", { align: "center" });
    
    doc.moveDown(0.5);
    doc.fontSize(28)
       .fillColor(colors.text)
       .text("Comprehensive Home Safety Report", { align: "center" });

    doc.moveDown(2);
    
    // Property information box
    doc.rect(100, 200, 395, 120)
       .fillAndStroke(colors.background, colors.lightGray);
    
    doc.fontSize(14)
       .fillColor(colors.text)
       .font('Helvetica')
       .text(`Property ZIP Code: ${audit.zipCode}`, 120, 230)
       .text(`Report Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 120, 250)
       .text(`Audit ID: ${audit.id}`, 120, 270)
       .text(`Primary Hazard: ${audit.primaryHazard || 'Multiple Hazards'}`, 120, 290);

    // Risk score display
    doc.moveDown(3);
    let riskColor = colors.success;
    if (riskAssessment.overallScore >= 8) riskColor = colors.danger;
    else if (riskAssessment.overallScore >= 6) riskColor = colors.warning;

    doc.fontSize(22)
       .fillColor(colors.primary)
       .font('Helvetica-Bold')
       .text("Overall Risk Assessment", { align: "center" });
    
    doc.moveDown(1);
    doc.fontSize(72)
       .fillColor(riskColor)
       .text(`${riskAssessment.overallScore}/10`, { align: "center" });
    
    doc.fontSize(18)
       .fillColor(colors.text)
       .font('Helvetica')
       .text(`Risk Level: ${riskAssessment.riskLevel}`, { align: "center" });

    // --- PAGE 2: EXECUTIVE SUMMARY ---
    doc.addPage();
    let currentY = 50;
    
    currentY = addSectionHeader("Executive Summary", currentY);
    
    doc.fontSize(12)
       .fillColor(colors.text)
       .font('Helvetica')
       .text(`This comprehensive safety assessment was conducted for the property in ZIP code ${audit.zipCode} on ${new Date().toLocaleDateString()}. Our analysis evaluated ${audit.primaryHazard?.toLowerCase() || 'multiple natural disaster'} risks and identified key vulnerabilities requiring attention.`, 40, currentY, {
         width: 515,
         align: "justify"
       });

    currentY += 60;
    
    doc.text(`Your property received an overall risk score of ${riskAssessment.overallScore} out of 10, indicating ${riskAssessment.riskLevel.toLowerCase()} risk levels. The primary concerns identified include: ${riskAssessment.primaryConcerns.join(', ') || 'general preparedness improvements'}.`, 40, currentY, {
      width: 515,
      align: "justify"
    });

    currentY += 80;
    currentY = addDivider(currentY);

    // Risk breakdown by category
    currentY = addSectionHeader("Risk Breakdown by Category", currentY);
    
    const categories = [
      { name: 'Earthquake', score: riskAssessment.categoryScores.earthquake },
      { name: 'Wildfire', score: riskAssessment.categoryScores.wildfire },
      { name: 'Flood', score: riskAssessment.categoryScores.flood },
      { name: 'Hurricane', score: riskAssessment.categoryScores.hurricane }
    ];

    categories.forEach((category, index) => {
      let categoryColor = colors.success;
      if (category.score >= 8) categoryColor = colors.danger;
      else if (category.score >= 6) categoryColor = colors.warning;

      const y = currentY + (index * 35);
      
      doc.fontSize(12)
         .fillColor(colors.text)
         .font('Helvetica-Bold')
         .text(category.name, 40, y);
      
      // Risk score bar
      doc.rect(150, y - 2, 200, 15)
         .fillAndStroke(colors.background, colors.lightGray);
      
      const barWidth = (category.score / 10) * 200;
      doc.rect(150, y - 2, barWidth, 15)
         .fill(categoryColor);
      
      doc.fontSize(12)
         .fillColor(colors.text)
         .font('Helvetica')
         .text(`${category.score}/10`, 370, y);
    });

    // --- PAGE 3: USER ANSWERS ANALYSIS ---
    doc.addPage();
    currentY = 50;
    
    currentY = addSectionHeader("Detailed Answer Analysis", currentY);
    
    userAnalysis.forEach((item, index) => {
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }

      // Question and answer
      doc.fontSize(12)
         .fillColor(colors.primary)
         .font('Helvetica-Bold')
         .text(`${item.question}:`, 40, currentY);
      
      currentY += 20;
      doc.fontSize(11)
         .fillColor(colors.text)
         .font('Helvetica')
         .text(`Your Answer: ${item.answer}`, 40, currentY);
      
      currentY += 25;
      
      // Analysis
      doc.fontSize(11)
         .fillColor(colors.text)
         .font('Helvetica')
         .text(item.analysis, 40, currentY, { width: 515 });
      
      currentY += 40;
      
      // FEMA quote box
      doc.rect(40, currentY, 515, 40)
         .fillAndStroke(colors.background, colors.primary);
      
      doc.fontSize(10)
         .fillColor(colors.accent)
         .font('Helvetica-Oblique')
         .text(item.femaQuote, 50, currentY + 15, { width: 495 });
      
      currentY += 60;
    });

    // --- PAGE 4: PRIORITY UPGRADES ---
    doc.addPage();
    currentY = 50;
    
    currentY = addSectionHeader("Priority Upgrades & Recommendations", currentY);
    
    upgradePriorities.forEach((upgrade, index) => {
      if (currentY > 650) {
        doc.addPage();
        currentY = 50;
      }

      let priorityColor = colors.success;
      if (upgrade.priority === 'High') priorityColor = colors.danger;
      else if (upgrade.priority === 'Medium') priorityColor = colors.warning;

      // Priority badge
      doc.rect(40, currentY, 60, 20)
         .fill(priorityColor);
      
      doc.fontSize(10)
         .fillColor(colors.white)
         .font('Helvetica-Bold')
         .text(upgrade.priority, 45, currentY + 6);
      
      // Category and description
      doc.fontSize(12)
         .fillColor(colors.text)
         .font('Helvetica-Bold')
         .text(`${upgrade.category}: ${upgrade.description}`, 110, currentY + 5);
      
      currentY += 30;
      
      // Cost and savings
      doc.fontSize(10)
         .fillColor(colors.text)
         .font('Helvetica')
         .text(`Estimated Cost: ${upgrade.costEstimate}`, 40, currentY)
         .text(`Potential Savings: ${upgrade.potentialSavings}`, 300, currentY);
      
      currentY += 20;
      
      // FEMA reference
      doc.fontSize(9)
         .fillColor(colors.lightGray)
         .font('Helvetica-Oblique')
         .text(`Reference: ${upgrade.femaReference}`, 40, currentY);
      
      currentY += 35;
    });

    // --- PAGE 5: COST ESTIMATES & GRANTS ---
    doc.addPage();
    currentY = 50;
    
    currentY = addSectionHeader("Cost Estimates & Financial Assistance", currentY);
    
    // Total cost summary
    const totalLowCost = upgradePriorities.reduce((sum, upgrade) => {
      const range = upgrade.costEstimate.match(/\$?([\d,]+)/);
      return sum + (range ? parseInt(range[1].replace(',', '')) : 0);
    }, 0);
    
    doc.fontSize(12)
       .fillColor(colors.text)
       .font('Helvetica')
       .text(`Total Estimated Investment: $${totalLowCost.toLocaleString()} - $${(totalLowCost * 2).toLocaleString()}`, 40, currentY);
    
    currentY += 40;
    currentY = addDivider(currentY);
    
    // Grant opportunities
    currentY = addSectionHeader("Available Grants & Rebates", currentY);
    
    grantOpportunities.forEach((grant, index) => {
      if (currentY > 650) {
        doc.addPage();
        currentY = 50;
      }

      doc.fontSize(12)
         .fillColor(colors.primary)
         .font('Helvetica-Bold')
         .text(grant.program, 40, currentY);
      
      currentY += 20;
      
      doc.fontSize(10)
         .fillColor(colors.text)
         .font('Helvetica')
         .text(`Agency: ${grant.agency}`, 40, currentY)
         .text(`Maximum Amount: ${grant.maxAmount}`, 300, currentY);
      
      currentY += 15;
      
      doc.text(`Eligibility: ${grant.eligibility}`, 40, currentY);
      currentY += 15;
      
      doc.text(`Application Period: ${grant.applicationPeriod}`, 40, currentY);
      currentY += 30;
    });

    // --- FOOTER ON EACH PAGE ---
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      
      doc.fontSize(8)
         .fillColor(colors.lightGray)
         .font('Helvetica')
         .text(`Generated by Disaster Dodger™ - Professional Home Safety Assessment`, 40, 770, {
           width: 515,
           align: "center"
         })
         .text(`Page ${i + 1} of ${range.count}`, 40, 785, {
           width: 515,
           align: "center"
         });
    }

    // Mark audit as completed
    await storage.updateAudit(auditId, { completed: true });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate comprehensive PDF report" });
  }
}
