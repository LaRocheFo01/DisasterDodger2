import PDFDocument from "pdfkit";
import { Request, Response } from "express";
import { storage } from "./storage";
import type { Audit } from "@shared/schema";

function calculateRiskScore(audit: Audit): number {
  // Simple risk calculation based on audit responses
  let score = 5; // Base score
  
  // Add risk based on various factors in audit responses
  if (audit.auditResponses) {
    Object.keys(audit.auditResponses).forEach(key => {
      const value = audit.auditResponses![key];
      if (typeof value === 'string' && value.toLowerCase().includes('no')) {
        score += 1;
      }
    });
  }
  
  return Math.min(score, 10);
}

function generateRecommendations(audit: Audit): string[] {
  const recommendations: string[] = [];
  
  // Generate recommendations based on hazard type and individual column responses
  if (audit.primaryHazard === 'Earthquake') {
    if (audit.waterHeaterSecurity === 'Not secured at all') {
      recommendations.push("Secure your water heater with straps and flexible connectors to prevent damage during earthquakes");
    }
    if (audit.gasShutoffPlan === 'No wrench or plan') {
      recommendations.push("Install a gas shutoff wrench and train all family members on its location and use");
    }
    if (audit.emergencyKit?.includes('None')) {
      recommendations.push("Assemble a 72-hour emergency kit with water, food, first-aid supplies, and flashlights");
    }
  } else if (audit.primaryHazard === 'Wildfire') {
    if (audit.defensibleSpaceWidth === '< 10 ft') {
      recommendations.push("Expand defensible space to at least 30 feet around your home for wildfire protection");
    }
    if (audit.roofMaterial === 'Standard shingles') {
      recommendations.push("Consider upgrading to Class A fire-rated roofing materials");
    }
    if (audit.ventProtection === 'None') {
      recommendations.push("Install mesh screens and shutters on all vents to prevent ember intrusion");
    }
  } else if (audit.primaryHazard === 'Flood') {
    if (audit.equipmentElevation === 'Below flood level') {
      recommendations.push("Elevate utilities and equipment above the base flood elevation");
    }
    if (audit.backflowPrevention === 'None') {
      recommendations.push("Install backflow prevention valves to protect against sewer backup");
    }
    if (audit.floodBarriers === 'None') {
      recommendations.push("Consider installing flood shields or barriers for doors and windows");
    }
  } else if (audit.primaryHazard === 'Hurricane') {
    if (audit.windowDoorProtection === 'None') {
      recommendations.push("Install storm shutters or impact-resistant windows for hurricane protection");
    }
    if (audit.roofInspection === 'Never checked') {
      recommendations.push("Have your roof professionally inspected and secure loose shingles or tiles");
    }
    if (audit.garageDoorUpgrade === 'None') {
      recommendations.push("Upgrade garage doors with reinforced panels and stronger tracks");
    }
  }
  
  // Add general recommendations if specific ones are limited
  const generalRecs = [
    "Review and update your homeowner's insurance coverage annually",
    "Create a family emergency communication plan",
    "Keep important documents in a waterproof, fireproof safe",
    "Install battery-powered or hand-crank emergency radio",
    "Maintain emergency supply of cash in small bills"
  ];
  
  // Fill remaining slots with general recommendations
  while (recommendations.length < 5 && generalRecs.length > 0) {
    recommendations.push(generalRecs.shift()!);
  }
  
  return recommendations.slice(0, 5);
}

export async function generatePDFReport(req: Request, res: Response) {
  try {
    const auditId = parseInt(req.params.id);
    const audit = await storage.getAudit(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    // Set headers for PDF download
    const filename = `Disaster_Dodger_Audit_${audit.zipCode}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Create PDF document
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    // Color scheme
    const colors = {
      primary: "#16A34A",
      secondary: "#0F4C81", 
      text: "#000000",
      lightGray: "#6B7280"
    };

    // --- Page 1: Cover Page ---
    doc.fontSize(32).fillColor(colors.primary)
       .text("Disaster Dodger™", { align: "center" });
    
    doc.moveDown(0.5);
    doc.fontSize(24).fillColor(colors.text)
       .text("Home Safety Audit Report", { align: "center" });

    doc.moveDown(2);
    doc.fontSize(16).fillColor(colors.lightGray)
       .text(`Property ZIP Code: ${audit.zipCode}`)
       .text(`Report Date: ${new Date().toLocaleDateString()}`)
       .text(`Audit ID: ${audit.id}`)
       .text(`Primary Hazard: ${audit.primaryHazard || 'Multiple Hazards'}`);

    // Calculate risk score
    const riskScore = calculateRiskScore(audit);
    
    doc.moveDown(3);
    doc.fontSize(20).fillColor(colors.primary)
       .text("Overall Risk Assessment", { align: "center" });
    
    doc.moveDown(1);
    doc.fontSize(48).fillColor(colors.secondary)
       .text(`${riskScore}/10`, { align: "center" });

    // --- Page 2: Executive Summary ---
    doc.addPage();
    doc.fontSize(24).fillColor(colors.primary)
       .text("Executive Summary");

    doc.moveDown(1);
    doc.fontSize(12).fillColor(colors.text)
       .text(`This comprehensive home safety audit was conducted for the property located in ZIP code ${audit.zipCode}. The assessment evaluated potential risks from natural disasters and identified key areas for improvement.`, {
         width: 495,
         align: "justify"
       });

    doc.moveDown(1);
    doc.text(`Based on our analysis, your property has been assigned a risk score of ${riskScore} out of 10, with the primary concern being ${audit.primaryHazard || 'multiple hazard types'}. This report provides actionable recommendations to enhance your home's resilience and safety.`);

    // --- Page 3: Recommendations ---
    doc.addPage();
    doc.fontSize(24).fillColor(colors.primary)
       .text("Priority Recommendations");

    doc.moveDown(1);
    const recommendations = generateRecommendations(audit);
    
    recommendations.forEach((rec, index) => {
      doc.fontSize(12).fillColor(colors.text)
         .text(`${index + 1}. ${rec}`, {
           width: 495,
           indent: 20
         });
      doc.moveDown(0.5);
    });

    // --- Page 4: Detailed Assessment Results ---
    doc.addPage();
    doc.fontSize(24).fillColor(colors.primary)
       .text("Detailed Assessment Results");

    doc.moveDown(1);

    // Section A: General Home Information
    doc.fontSize(16).fillColor(colors.secondary)
       .text("🏡 General Home Information");
    doc.moveDown(0.5);
    
    const generalInfo = [
      { label: "Home Type", value: audit.homeTypeResponse },
      { label: "Year Built", value: audit.yearBuiltResponse },
      { label: "Ownership Status", value: audit.ownershipStatusResponse },
      { label: "Insured Value", value: audit.insuredValueResponse },
      { label: "Previous Grants", value: audit.previousGrantsResponse }
    ];
    
    generalInfo.forEach(item => {
      if (item.value) {
        doc.fontSize(11).fillColor(colors.text)
           .text(`${item.label}: ${item.value}`, { width: 495 });
        doc.moveDown(0.2);
      }
    });
    doc.moveDown(0.5);

    // Primary Hazard Specific Questions
    if (audit.primaryHazard === 'Earthquake') {
      doc.fontSize(16).fillColor(colors.secondary)
         .text("🌐 Earthquake Readiness Assessment");
      doc.moveDown(0.5);
      
      const earthquakeResponses = [
        { label: "Water Heater Security", value: audit.waterHeaterSecurity },
        { label: "Gas Shutoff Plan", value: audit.gasShutoffPlan },
        { label: "Cabinet Latches", value: audit.cabinetLatches },
        { label: "Electronics Stability", value: audit.electronicsStability },
        { label: "Foundation Work", value: audit.foundationWork }
      ];
      
      earthquakeResponses.forEach(item => {
        if (item.value) {
          doc.fontSize(11).fillColor(colors.text)
             .text(`${item.label}: ${item.value}`, { width: 495 });
          doc.moveDown(0.2);
        }
      });
    } else if (audit.primaryHazard === 'Flood') {
      doc.fontSize(16).fillColor(colors.secondary)
         .text("🌊 Flood Mitigation Assessment");
      doc.moveDown(0.5);
      
      const floodResponses = [
        { label: "Equipment Elevation", value: audit.equipmentElevation },
        { label: "Flood Barriers", value: audit.floodBarriers },
        { label: "Backflow Prevention", value: audit.backflowPrevention },
        { label: "Sump Pump", value: audit.sumpPump },
        { label: "Flood Shields", value: audit.floodShields },
        { label: "Perimeter Drainage", value: audit.perimeterDrainage }
      ];
      
      floodResponses.forEach(item => {
        if (item.value) {
          doc.fontSize(11).fillColor(colors.text)
             .text(`${item.label}: ${item.value}`, { width: 495 });
          doc.moveDown(0.2);
        }
      });
    } else if (audit.primaryHazard === 'Wildfire') {
      doc.fontSize(16).fillColor(colors.secondary)
         .text("🔥 Wildfire Hardening Assessment");
      doc.moveDown(0.5);
      
      const wildfireResponses = [
        { label: "Defensible Space Width", value: audit.defensibleSpaceWidth },
        { label: "Roof Material", value: audit.roofMaterial },
        { label: "Vent Protection", value: audit.ventProtection },
        { label: "Wall Cladding", value: audit.wallCladding },
        { label: "Window Glazing", value: audit.windowGlazing }
      ];
      
      wildfireResponses.forEach(item => {
        if (item.value) {
          doc.fontSize(11).fillColor(colors.text)
             .text(`${item.label}: ${item.value}`, { width: 495 });
          doc.moveDown(0.2);
        }
      });
    } else if (audit.primaryHazard === 'Hurricane') {
      doc.fontSize(16).fillColor(colors.secondary)
         .text("💨 Hurricane & High-Wind Protection");
      doc.moveDown(0.5);
      
      const hurricaneResponses = [
        { label: "Roof Inspection", value: audit.roofInspection },
        { label: "Window/Door Protection", value: audit.windowDoorProtection },
        { label: "Garage Door Upgrade", value: audit.garageDoorUpgrade },
        { label: "Roof Covering", value: audit.roofCovering },
        { label: "Siding Material", value: audit.sidingMaterial }
      ];
      
      hurricaneResponses.forEach(item => {
        if (item.value) {
          doc.fontSize(11).fillColor(colors.text)
             .text(`${item.label}: ${item.value}`, { width: 495 });
          doc.moveDown(0.2);
        }
      });
    }

    // --- Footer ---
    doc.fontSize(10).fillColor(colors.lightGray)
       .text("Generated by Disaster Dodger™ - Your Partner in Home Safety Preparedness", 50, 750, {
         align: "center",
         width: 495
       });

    // Mark audit as completed
    await storage.updateAudit(auditId, { completed: true });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF report" });
  }
}