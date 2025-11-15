/**
 * Tape Testing Calculations
 * Based on collected data on pressure-sensitive adhesive (PSA) tapes
 * 
 * References:
 * - 3M Scotch 508: 25µm BOPP backing + 15µm acrylic = 40µm total, 260 cN/cm adhesion
 * - 3M Scotch 373: 41µm PP backing + 23µm rubber = 64µm total, 54.7 N/100mm adhesion
 * - tesa 60408: 125µm paper backing with natural rubber, 2.8 N/cm adhesion
 * - Typical ranges: Office tapes 25-50µm, masking 80-150µm, packaging 60-100µm
 */

// ============================================================================
// MATERIAL PROPERTIES DATABASE
// ============================================================================

/**
 * Backing material properties
 * Based on real product specifications and industry data
 */
export const BACKING_MATERIALS = {
	'PVC': {
		name: 'PVC (Polyvinyl Chloride)',
		typicalThickness: { min: 150, max: 180, standard: 165 }, // µm
		tensileStrength: 30, // MPa
		elongation: 25, // % at break (minimal stretch in finished form)
		temperatureRange: { min: -10, max: 60 }, // °C
		uvResistance: 'poor',
		description: 'Standard electrical/insulation tape backing'
	},
	'PET': {
		name: 'PET (Polyester)',
		typicalThickness: { min: 25, max: 50, standard: 36 }, // µm
		tensileStrength: 220, // MPa - very high
		elongation: 8, // % - very rigid
		temperatureRange: { min: -40, max: 150 }, // °C
		uvResistance: 'excellent',
		description: 'High-performance polyester film, very rigid'
	},
	'PP': {
		name: 'PP (Polypropylene)',
		typicalThickness: { min: 25, max: 50, standard: 41 }, // µm (3M 373 spec)
		tensileStrength: 525, // N/100mm (from 3M 373)
		elongation: 40, // % - moderate stretch in finished form
		temperatureRange: { min: -20, max: 80 }, // °C
		uvResistance: 'good',
		description: 'Biaxially-oriented PP (BOPP) for packaging/sealing'
	},
	'BOPP': {
		name: 'BOPP (Biaxially Oriented Polypropylene)',
		typicalThickness: { min: 20, max: 30, standard: 25 }, // µm (3M 508 spec)
		tensileStrength: 140, // MPa
		elongation: 15, // % - minimal stretch due to orientation
		temperatureRange: { min: -20, max: 80 }, // °C
		uvResistance: 'good',
		description: 'Clear office tape backing (Scotch 508)'
	},
	'Paper': {
		name: 'Paper (Kraft/Crepe)',
		typicalThickness: { min: 80, max: 150, standard: 125 }, // µm (tesa 60408)
		tensileStrength: 40, // MPa (kraft paper)
		elongation: 2, // % - virtually no stretch
		temperatureRange: { min: 0, max: 50 }, // °C
		uvResistance: 'fair',
		description: 'Masking/painter\'s tape or packaging tape backing'
	},
	'Cloth': {
		name: 'Cloth (Fabric/Scrim)',
		typicalThickness: { min: 200, max: 300, standard: 250 }, // µm
		tensileStrength: 80, // MPa
		elongation: 12, // % - limited controlled stretch
		temperatureRange: { min: -10, max: 70 }, // °C
		uvResistance: 'good',
		description: 'Duct/gaffer tape backing with fabric reinforcement'
	},
	'Foam': {
		name: 'Foam (PE/PU)',
		typicalThickness: { min: 400, max: 3000, standard: 800 }, // µm
		tensileStrength: 2, // MPa - very compressible
		elongation: 200, // % - highly elastic
		temperatureRange: { min: -20, max: 80 }, // °C
		uvResistance: 'fair',
		description: 'Double-sided mounting tape with foam core'
	}
};

/**
 * Adhesive chemistry properties
 * Based on 3M and industry technical data
 */
export const ADHESIVE_TYPES = {
	'Acrylic': {
		name: 'Acrylic PSA',
		typicalThickness: { min: 15, max: 50, standard: 25 }, // µm
		peelAdhesion: 260, // cN/cm (3M 508 reference)
		tackLevel: 'medium',
		temperatureRange: { min: -40, max: 100 }, // °C
		uvResistance: 'excellent',
		agingStability: 'excellent',
		shearStrength: 'high',
		colorStability: 'non-yellowing',
		surfaceAffinitiy: {
			highEnergy: 'excellent', // metals, glass
			lowEnergy: 'poor', // PE, PP - needs primer
			porous: 'good' // paper, wood
		},
		description: 'UV-stable, clear, excellent aging. Best for metals/glass. Standard office tape adhesive.'
	},
	'Rubber': {
		name: 'Rubber-based PSA',
		typicalThickness: { min: 50, max: 125, standard: 75 }, // µm (thicker for texture)
		peelAdhesion: 547, // N/100mm = ~54.7 N/10cm (3M 373 reference)
		tackLevel: 'high',
		temperatureRange: { min: -20, max: 60 }, // °C - degrades above
		uvResistance: 'poor',
		agingStability: 'fair',
		shearStrength: 'medium',
		colorStability: 'yellows over time',
		surfaceAffinitiy: {
			highEnergy: 'excellent',
			lowEnergy: 'good', // can bond PE/PP
			porous: 'excellent' // great mechanical interlock
		},
		description: 'High initial tack, bonds low-energy plastics. Degrades in UV/heat. Packaging tape adhesive.'
	},
	'Silicone': {
		name: 'Silicone PSA',
		typicalThickness: { min: 25, max: 75, standard: 50 }, // µm
		peelAdhesion: 200, // cN/cm (lower than acrylic on most surfaces)
		tackLevel: 'low',
		temperatureRange: { min: -40, max: 260 }, // °C - extreme range
		uvResistance: 'excellent',
		agingStability: 'excellent',
		shearStrength: 'very high',
		colorStability: 'stable',
		surfaceAffinitiy: {
			highEnergy: 'fair',
			lowEnergy: 'fair',
			porous: 'poor',
			silicone: 'excellent' // unique property
		},
		description: 'Extreme temperature tolerance. Low adhesion but high cohesion. Specialty applications.'
	}
};

/**
 * Surface material properties affecting adhesion
 */
export const SURFACE_MATERIALS = {
	'Steel': {
		name: 'Steel (Stainless/Cold Rolled)',
		surfaceEnergy: 'high', // >40 mN/m
		texture: 'smooth',
		adhesionMultiplier: 1.0, // reference baseline
		description: 'Standard test surface. High energy, excellent bonding.'
	},
	'Aluminum': {
		name: 'Aluminum (Mill Finish)',
		surfaceEnergy: 'high',
		texture: 'smooth',
		adhesionMultiplier: 0.95,
		description: 'Similar to steel but slightly lower adhesion due to oxide layer.'
	},
	'Glass': {
		name: 'Glass (Smooth)',
		surfaceEnergy: 'high',
		texture: 'very smooth',
		adhesionMultiplier: 1.05,
		description: 'Excellent for acrylic PSAs. Very high surface energy.'
	},
	'Textured Glass': {
		name: 'Glass (Textured/Frosted)',
		surfaceEnergy: 'high',
		texture: 'rough',
		adhesionMultiplier: 0.75,
		description: 'Reduced contact area. Requires thicker adhesive layer (125µm recommended).'
	},
	'Plastic Bag': {
		name: 'Plastic Bag (PE/LDPE)',
		surfaceEnergy: 'low', // ~30 mN/m
		texture: 'smooth',
		adhesionMultiplier: 0.4,
		description: 'Low-energy substrate. Poor bonding without LSE adhesive or primer.'
	},
	'Door Veneer': {
		name: 'Door Veneer (Wood)',
		surfaceEnergy: 'medium',
		texture: 'smooth to medium',
		adhesionMultiplier: 0.85,
		description: 'Porous substrate. Good mechanical interlock. May absorb adhesive.'
	},
	'Paper Note': {
		name: 'Paper Note (Smooth)',
		surfaceEnergy: 'high',
		texture: 'smooth',
		adhesionMultiplier: 0.9,
		description: 'High energy but can absorb adhesive. Risk of fiber tear on removal.'
	},
	'Manga Paper': {
		name: 'Manga Paper (Uncoated)',
		surfaceEnergy: 'high',
		texture: 'smooth',
		adhesionMultiplier: 0.85,
		description: 'Absorbent paper. Will show damage on peel. Use low-tack tape.'
	},
	'Sketchbook Paper': {
		name: 'Sketchbook Paper (Textured)',
		surfaceEnergy: 'high',
		texture: 'medium',
		adhesionMultiplier: 0.8,
		description: 'Textured surface reduces contact. Fiber damage likely on removal.'
	},
	'Rough Carton': {
		name: 'Rough Carton (Corrugated)',
		surfaceEnergy: 'medium',
		texture: 'rough',
		adhesionMultiplier: 0.7,
		description: 'Porous and rough. Requires thick adhesive (125µm). Good mechanical lock.'
	},
	'Wall Paint': {
		name: 'Wall Paint (Smooth/New)',
		surfaceEnergy: 'medium',
		texture: 'smooth',
		adhesionMultiplier: 0.6,
		description: 'Use only low-tack masking tape. Risk of paint pull if paint <24h old.'
	},
	'Damaged Wall Paint': {
		name: 'Wall Paint (Damaged/Old)',
		surfaceEnergy: 'low',
		texture: 'rough',
		adhesionMultiplier: 0.3,
		description: 'Very high risk of paint removal. Use delicate-surface masking tape only.'
	},
	'Photo': {
		name: 'Photo Print (Instax/Glossy)',
		surfaceEnergy: 'medium',
		texture: 'smooth',
		adhesionMultiplier: 0.75,
		description: 'Requires acid-free/archival tape. Standard tapes may damage image.'
	}
};

/**
 * Environmental condition data
 * Based on climate classifications and adhesive performance studies
 */
export const ENVIRONMENTAL_CONDITIONS = {
	'Humid': {
		name: 'Humid (Temperate Humid)',
		temperature: { min: 15, max: 25, typical: 20 }, // °C
		humidity: { min: 70, max: 90, typical: 80 }, // %
		description: 'High moisture can form micro-barrier preventing wet-out. Reduced tack.',
		adhesionMultiplier: 0.75,
		agingFactor: 1.2 // faster degradation
	},
	'Tropical': {
		name: 'Tropical (Hot & Humid)',
		temperature: { min: 25, max: 35, typical: 30 }, // °C
		humidity: { min: 75, max: 95, typical: 85 }, // %
		description: 'Worst case: heat softens adhesive + moisture barrier. Bond failure risk.',
		adhesionMultiplier: 0.65,
		agingFactor: 1.5 // rapid degradation
	},
	'Semiarid': {
		name: 'Semiarid (Mediterranean)',
		temperature: { min: 20, max: 30, typical: 25 }, // °C
		humidity: { min: 30, max: 50, typical: 40 }, // %
		description: 'Balanced conditions. Moderate heat, low moisture. Good performance.',
		adhesionMultiplier: 0.95,
		agingFactor: 1.0
	},
	'Arid': {
		name: 'Arid (Desert/Hot Dry)',
		temperature: { min: 25, max: 40, typical: 32 }, // °C
		humidity: { min: 10, max: 30, typical: 20 }, // %
		description: 'High heat accelerates adhesive flow/creep. Dry surfaces bond well initially.',
		adhesionMultiplier: 0.85,
		agingFactor: 1.3 // heat aging
	},
	'Dry': {
		name: 'Dry (Temperate Dry/Indoor)',
		temperature: { min: 18, max: 25, typical: 21 }, // °C
		humidity: { min: 20, max: 40, typical: 30 }, // %
		description: 'Ideal conditions. Recommended storage: 20°C/50%RH. Best performance.',
		adhesionMultiplier: 1.0, // reference baseline
		agingFactor: 0.8 // slow aging
	}
};

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate total tape thickness from backing + adhesive
 * @param {string} backingMaterial - Backing material type
 * @param {string} adhesiveType - Adhesive chemistry type
 * @returns {number} Total thickness in µm
 */
export function calculateTotalThickness(backingMaterial, adhesiveType) {
	const backing = BACKING_MATERIALS[backingMaterial];
	const adhesive = ADHESIVE_TYPES[adhesiveType];
	
	if (!backing || !adhesive) return 120; // default fallback
	
	return backing.typicalThickness.standard + adhesive.typicalThickness.standard;
}

/**
 * Calculate peel adhesion strength
 * Based on adhesive type, surface material, and environmental conditions
 * 
 * Formula: Base Adhesion × Surface Multiplier × Environment Multiplier × Thickness Factor
 * 
 * @param {Object} params - Calculation parameters
 * @returns {number} Peel adhesion in N/cm
 */
export function calculatePeelAdhesion(params) {
	const {
		tape,
		surface,
		adhesive,
		environment,
		thickness
	} = params;
	
	// Get base adhesion from adhesive type (convert cN/cm to N/cm)
	const adhesiveData = ADHESIVE_TYPES[adhesive] || ADHESIVE_TYPES['Acrylic'];
	let baseAdhesion = adhesiveData.peelAdhesion;
	
	// Normalize rubber adhesion (given as N/100mm = N/10cm, convert to N/cm)
	if (adhesive === 'Rubber') {
		baseAdhesion = baseAdhesion / 10; // 547 N/100mm → 54.7 N/10cm → 5.47 N/cm
	} else {
		baseAdhesion = baseAdhesion / 100; // cN/cm to N/cm
	}
	
	// Surface multiplier
	const surfaceData = SURFACE_MATERIALS[surface] || SURFACE_MATERIALS['Steel'];
	const surfaceMultiplier = surfaceData.adhesionMultiplier;
	
	// Environmental multiplier
	const envData = ENVIRONMENTAL_CONDITIONS[environment] || ENVIRONMENTAL_CONDITIONS['Dry'];
	const envMultiplier = envData.adhesionMultiplier;
	
	// Thickness factor (thicker adhesive = better contact on rough surfaces)
	// Normalized to standard thickness for that adhesive type
	const standardThickness = adhesiveData.typicalThickness.standard;
	const thicknessFactor = Math.pow(thickness / standardThickness, 0.3); // diminishing returns
	
	// Apply surface-specific adjustments for low-energy substrates
	let lowEnergyPenalty = 1.0;
	if (surfaceData.surfaceEnergy === 'low' && adhesive === 'Acrylic') {
		lowEnergyPenalty = 0.5; // acrylic poor on PE/PP without primer
	} else if (surfaceData.surfaceEnergy === 'low' && adhesive === 'Rubber') {
		lowEnergyPenalty = 0.8; // rubber better but still reduced
	}
	
	const finalAdhesion = baseAdhesion * surfaceMultiplier * envMultiplier * thicknessFactor * lowEnergyPenalty;
	
	return Math.max(0.1, finalAdhesion); // minimum 0.1 N/cm
}

/**
 * Calculate shear/hold strength
 * Represents resistance to sliding under continuous load
 * 
 * @param {Object} params - Calculation parameters
 * @returns {number} Hold strength in N/cm²
 */
export function calculateHoldStrength(params) {
	const {
		tape,
		surface,
		adhesive,
		environment,
		thickness
	} = params;
	
	// Shear strength is typically 1.5-3× higher than peel strength
	const peelStrength = calculatePeelAdhesion(params);
	
	// Adhesive-specific shear multipliers
	const shearMultipliers = {
		'Acrylic': 2.5, // high cohesive strength
		'Rubber': 2.0, // medium cohesive strength
		'Silicone': 3.5 // very high cohesive strength
	};
	
	const multiplier = shearMultipliers[adhesive] || 2.5;
	
	// Thickness helps with shear (more cohesive material)
	const adhesiveData = ADHESIVE_TYPES[adhesive] || ADHESIVE_TYPES['Acrylic'];
	const standardThickness = adhesiveData.typicalThickness.standard;
	const thicknessFactor = Math.pow(thickness / standardThickness, 0.4);
	
	const holdStrength = peelStrength * multiplier * thicknessFactor;
	
	return Math.max(0.5, holdStrength); // minimum 0.5 N/cm²
}

/**
 * Calculate tape elongation/stretch at break
 * Based on backing material properties
 * 
 * @param {Object} params - Calculation parameters
 * @returns {number} Elongation percentage
 */
export function calculateStretch(params) {
	const {
		tape,
		adhesive,
		thickness
	} = params;
	
	// Get base elongation from backing material
	const backingData = BACKING_MATERIALS[tape] || BACKING_MATERIALS['PVC'];
	let baseStretch = backingData.elongation;
	
	// Adhesive layer adds slight elasticity
	const adhesiveElasticity = {
		'Acrylic': 1.0, // rigid
		'Rubber': 1.15, // adds some elasticity
		'Silicone': 0.95 // very cohesive, reduces stretch
	};
	
	const adhesiveMultiplier = adhesiveElasticity[adhesive] || 1.0;
	
	// Thicker backing = slightly less relative stretch (more rigid structure)
	const standardThickness = backingData.typicalThickness.standard;
	const thicknessFactor = Math.pow(standardThickness / thickness, 0.15);
	
	const finalStretch = baseStretch * adhesiveMultiplier * thicknessFactor;
	
	return Math.max(1, finalStretch); // minimum 1%
}

/**
 * Calculate aging/degradation factor over time
 * Based on time exposure, environment, and material properties
 * 
 * @param {Object} params - Calculation parameters
 * @returns {Object} Aging factors for peel, hold, and stretch
 */
export function calculateAgingEffects(params) {
	const {
		adhesive,
		environment,
		timeImpactDays
	} = params;
	
	const envData = ENVIRONMENTAL_CONDITIONS[environment] || ENVIRONMENTAL_CONDITIONS['Dry'];
	const agingRate = envData.agingFactor;
	
	// UV/aging resistance by adhesive type
	const uvResistance = {
		'Acrylic': 0.995, // excellent - very slow degradation (0.5% loss per year)
		'Rubber': 0.980, // poor - yellows and loses tack (2% loss per year)
		'Silicone': 0.997 // excellent - very stable (0.3% loss per year)
	};
	
	const dailyDegradation = uvResistance[adhesive] || 0.990;
	const environmentAdjustedRate = Math.pow(dailyDegradation, agingRate);
	
	// Calculate retention after exposure time
	const retentionFactor = Math.pow(environmentAdjustedRate, timeImpactDays);
	
	// Stretch increases slightly over time due to creep (opposite of strength loss)
	const stretchIncrease = 1 + ((1 - retentionFactor) * 0.3);
	
	return {
		peelRetention: retentionFactor,
		holdRetention: retentionFactor * 0.95, // shear degrades slightly faster
		stretchChange: stretchIncrease
	};
}

/**
 * Calculate temperature effect on adhesion
 * Cold (<15°C) = stiff/low tack, Hot (>30°C) = soft/weak cohesion
 * 
 * @param {number} temperature - Temperature in °C
 * @param {string} adhesive - Adhesive type
 * @returns {number} Temperature multiplier (0-1)
 */
export function calculateTemperatureEffect(temperature, adhesive) {
	// Optimal range: 15-25°C (as per industry best practices)
	const optimalMin = 15;
	const optimalMax = 25;
	
	if (temperature >= optimalMin && temperature <= optimalMax) {
		return 1.0; // full performance
	}
	
	// Cold penalty
	if (temperature < optimalMin) {
		const coldPenalty = (optimalMin - temperature) * 0.03; // 3% loss per degree below 15°C
		return Math.max(0.4, 1.0 - coldPenalty);
	}
	
	// Heat penalty (varies by adhesive)
	const heatTolerance = {
		'Acrylic': 100, // tolerates up to 100°C
		'Rubber': 60, // degrades above 60°C
		'Silicone': 260 // extreme tolerance
	};
	
	const maxTemp = heatTolerance[adhesive] || 80;
	
	if (temperature > optimalMax) {
		const heatPenalty = (temperature - optimalMax) / (maxTemp - optimalMax);
		return Math.max(0.3, 1.0 - (heatPenalty * 0.5));
	}
	
	return 1.0;
}

/**
 * Main calculation function for all tape properties
 * Returns calculated values for display
 * 
 * @param {Object} params - All parameters from state
 * @returns {Object} Calculated properties
 */
export function calculateTapeProperties(params) {
	// Calculate base properties
	const peel = calculatePeelAdhesion(params);
	const hold = calculateHoldStrength(params);
	const stretch = calculateStretch(params);
	
	// Apply aging effects if time impact is specified
	let finalPeel = peel;
	let finalHold = hold;
	let finalStretch = stretch;
	
	if (params.timeImpactDays && params.timeImpactDays > 0) {
		const aging = calculateAgingEffects(params);
		finalPeel = peel * aging.peelRetention;
		finalHold = hold * aging.holdRetention;
		finalStretch = stretch * aging.stretchChange;
	}
	
	// Get environment temperature for temperature effect
	const envData = ENVIRONMENTAL_CONDITIONS[params.environment] || ENVIRONMENTAL_CONDITIONS['Dry'];
	const tempEffect = calculateTemperatureEffect(envData.temperature.typical, params.adhesive);
	
	finalPeel *= tempEffect;
	finalHold *= tempEffect;
	
	return {
		peel: finalPeel.toFixed(2),
		hold: finalHold.toFixed(2),
		stretch: finalStretch.toFixed(1),
		totalThickness: calculateTotalThickness(params.tape, params.adhesive),
		agingEffect: params.timeImpactDays > 0 ? calculateAgingEffects(params) : null,
		temperatureEffect: tempEffect.toFixed(3)
	};
}

/**
 * Get material information for display
 */
export function getMaterialInfo(materialType, materialName) {
	switch (materialType) {
		case 'backing':
			return BACKING_MATERIALS[materialName];
		case 'adhesive':
			return ADHESIVE_TYPES[materialName];
		case 'surface':
			return SURFACE_MATERIALS[materialName];
		case 'environment':
			return ENVIRONMENTAL_CONDITIONS[materialName];
		default:
			return null;
	}
}

/**
 * Calculate mixed tape properties
 * Averages properties of two different tape types to simulate a layered or composite tape
 * 
 * @param {Object} params - Calculation parameters including tape1 and tape2
 * @returns {Object} Mixed tape properties
 */
export function calculateMixedTapeProperties(params) {
	const {
		tape1,
		tape2,
		surface,
		adhesive,
		environment,
		thickness,
		timeImpactDays
	} = params;
	
	// Calculate properties for each tape individually
	const props1 = calculateTapeProperties({
		tape: tape1,
		surface,
		adhesive,
		environment,
		thickness: thickness / 2, // Each tape contributes half the thickness
		timeImpactDays
	});
	
	const props2 = calculateTapeProperties({
		tape: tape2,
		surface,
		adhesive,
		environment,
		thickness: thickness / 2,
		timeImpactDays
	});
	
	// Average the properties
	// For adhesion, use weighted average (surface contact is from one tape primarily)
	const avgPeel = (parseFloat(props1.peel) * 0.6 + parseFloat(props2.peel) * 0.4);
	const avgHold = (parseFloat(props1.hold) * 0.6 + parseFloat(props2.hold) * 0.4);
	
	// For stretch, the composite behavior is more complex - use harmonic mean
	// (the less stretchy material limits the overall stretch)
	const stretch1 = parseFloat(props1.stretch);
	const stretch2 = parseFloat(props2.stretch);
	const avgStretch = (2 * stretch1 * stretch2) / (stretch1 + stretch2);
	
	// Total thickness is sum of both backings plus adhesive layer
	const backing1 = BACKING_MATERIALS[tape1];
	const backing2 = BACKING_MATERIALS[tape2];
	const adhesiveData = ADHESIVE_TYPES[adhesive];
	const totalThickness = (backing1?.typicalThickness?.standard || 0) + 
	                       (backing2?.typicalThickness?.standard || 0) + 
	                       (adhesiveData?.typicalThickness?.standard || 0);
	
	return {
		peel: avgPeel.toFixed(2),
		hold: avgHold.toFixed(2),
		stretch: avgStretch.toFixed(1),
		totalThickness: Math.round(totalThickness),
		description: `Composite of ${tape1} and ${tape2}`
	};
}
