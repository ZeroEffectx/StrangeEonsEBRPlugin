/*
	Draw library for the Earthborne Rangers plugin
	Contains various methods to help with drawing objects on cards.
*/

function createTextBox(diy, sheet, settingName) {
	var textBox = markupBox(sheet);
	textBox.defaultStyle = diy.settings.getTextStyle(settingName, null);
	textBox.alignment = diy.settings.getTextAlignment(settingName);
	textBox.setTextFitting(FIT_SCALE_TEXT);
	return textBox;
}

function drawRotatedTextBox (g, region, rotatedTextBox) {
	var oldTransform = g.getTransform();
	g.rotate(-Math.PI/2,0,0);
	var newRegion = region.clone();
	var x = region.getX(); 
	var y = region.getY();
	var w = region.getWidth();
	var h = region.getHeight();
	newRegion.setRect( -h-y, x, h, w );
	rotatedTextBox.draw( g, newRegion );
	g.setTransform( oldTransform );
}

function isSelectedOptionBiome(selectedOption) {
	let EBRObject = Eons.namedObjects.EBRObject;
	return EBRObject.coreBiomePathSets.map((biome) => biome[0]).find((biomeName) => biomeName == selectedOption) !== undefined ||
		EBRObject.arcologyBiomePathSets.map((biome) => biome[0]).find((biomeName) => biomeName == selectedOption) !== undefined;
}

function drawSetIcon(g, sheet, setName, region, fillBg) {
	if(setName !== 'Generic') {
		if(setName == 'CustomSet') {
			PortraitList[3].paint( g, sheet.getRenderTarget() );		
		}
		else {
			if(fillBg) {
				// If the selected set is a biome (and not a location), paint the Generic icon as a backing frame
				if(isSelectedOptionBiome(setName)) {
					sheet.paintImage(g, ImageUtils.get('ebr/icons/path-sets/Generic.png'), region);
				}	
				if(setName == 'General') {
					sheet.paintImage(g, ImageUtils.get('ebr/icons/path-sets/GenericDiamond.png'), region );
				}
			}
			sheet.paintImage( g, ImageUtils.get('ebr/icons/path-sets/' + setName + '.png'), region );
		}
	}
}

function drawThresholdValueFixed(g, diy, sheet, overlay, frame, region, thresholdAmount, isPerRanger, textBox, offset) {
	region.y += offset;
	sheet.paintImage(g, overlay, region); //Draw the box background
	sheet.paintImage(g, frame, region); //Draw the frame around the box
	
	let thresholdText = thresholdAmount;
	if(isPerRanger == 1) {
		initBodyTags(diy, textBox);
		thresholdText += '<size 20.0><per></size>'; //This threshold uses the ranger token icon, replace the text with the appropriate tag
	}
	
	region.x -= 5;
	textBox.markupText = thresholdText;
	textBox.draw(g, region);
}

function drawThresholdValue(g, diy, sheet, thresholdType, thresholdName, regionName, thresholdTextBox, thresholdPerRangerTextBox, offset) {
		var cardType = thresholdType == 'Path' ? 'Path' : 'Ranger';
		var boxRegion = diy.settings.getRegion(cardType + '-Card-' + regionName);
		boxRegion.y += offset;
		if($(thresholdName) == '<i>/</i>') {
			sheet.paintImage( g, ImageUtils.get('ebr/overlays/thresholds/Dark-' + thresholdName + '-Box.png'), boxRegion);
		}
		else {
			sheet.paintImage( g, ImageUtils.get('ebr/overlays/thresholds/' + thresholdName + '-Box.png'), boxRegion);
		}
		var frameRegion = diy.settings.getRegion(cardType + '-Card-' + regionName);
		frameRegion.y += offset;
		sheet.paintImage( g, ImageUtils.get('ebr/overlays/thresholds/' + thresholdType + '-Threshold-Frame.png'), frameRegion);
		var thresholdValue = $(thresholdName);
		var thresholdText = $(thresholdName);
		var thresholdTextRegion = diy.settings.getRegion(cardType + '-Card-' + regionName + '-Text');
		thresholdTextRegion.y += offset;
		
		if (thresholdValue > 9 && thresholdValue < 20) {
			thresholdTextRegion.x -= 2;
		}
		if (thresholdText == 'Ranger') {
			thresholdTextRegion.y -= 7;
			thresholdTextRegion.x += 1;
			thresholdText = '<size 32.0><ebrs>E</ebrs></size>';
		}
		else if ($(thresholdName + 'PerRanger') != '0') {
			var thresholdPerRangerTextRegion = diy.settings.getRegion(cardType + '-Card-' + regionName + '-PerRanger-Text');
			thresholdPerRangerTextRegion.y += offset;
			if (thresholdValue == 'X') {
				thresholdTextRegion.x += 1;
				thresholdPerRangerTextRegion.x += 4;
			}
			if (thresholdValue > 9) {
				thresholdText = '<size 25.0>' + thresholdText + '</size>';
				thresholdTextRegion.x -= 12;
				thresholdTextRegion.y += 3;
				thresholdPerRangerTextRegion.x += 10;
				thresholdPerRangerTextRegion.y -= 3;
				thresholdPerRangerTextBox.markupText = '<size 16.0>R</size>';
				if (thresholdValue > 19) {
					thresholdTextRegion.x -= 2;
				}
			}
			else {
				thresholdTextRegion.x -= 18;
				thresholdPerRangerTextBox.markupText = 'R';
			}
			thresholdPerRangerTextBox.draw(g, thresholdPerRangerTextRegion);
		}
		thresholdTextBox.markupText = thresholdText;
		thresholdTextBox.draw(g, thresholdTextRegion);
}

/// Draws challenge effects in a stack, omitting ones that don't have a value for that card
/// Parameters:
///		cardType: Name of the card you're drawing, used to direct the code to the proper .settings file
///		effects: ARRAY (!) of the challenge effects, in the order [ sun, mountain, crest ]
function drawChallengeEffects( g, diy, sheet, cardType, effects ) {
	let effectNames = [ 'Sun', 'Mountain', 'Crest' ]; // Easy way to use the index of the loop to look up the name
	let effectsDrawn = 0; //Becomes the scale by which we push up effects as we draw them
	for(i = 2; i >= 0; i--) { //Draw effects in reverse order
		if(effects[i] != '') { 		
			var challengeRegion = diy.settings.getRegion(cardType + '-Card-Challenge-Start-region');
			challengeRegion.y -= diy.settings.get(cardType + '-Card-Challenge-Height') * effectsDrawn; //Moves additional boxes drawn up
			sheet.paintImage(g, ImageUtils.get('ebr/overlays/challenge/' + cardType + '-Challenge-' + effectNames[i] + '.png'), challengeRegion);
			
			let curChallengeTextBox = createTextBox(diy, sheet, cardType+'-Card-Challenge');
			initSpecialBodyTags(diy, curChallengeTextBox, 'ChallengeEffect');
			initBodyTags(diy, curChallengeTextBox);
			initBodyStyleTags(diy, curChallengeTextBox);
			curChallengeTextBox.markupText = effects[i];
			var challengeTextRegion = diy.settings.getRegion(cardType + '-Card-Challenge-Text-Start-region');
			challengeTextRegion.y -= diy.settings.get(cardType + '-Card-Challenge-Height') * effectsDrawn; //Moves additional boxes drawn up
			curChallengeTextBox.draw(g, challengeTextRegion);
			
			effectsDrawn++; //Record that we've drawn a box so future boxes will draw above it
		}
	}
}

function drawMissionBodyFull( g, diy, sheet, bodyBox, objectiveTextBox, bodyRegion, text1, text2, objectiveType1, objectiveName1, objectiveType2, objectiveName2, objectiveType3, objectiveName3) {
	drawMissionBody( g, diy, sheet, bodyBox, bodyRegion, text1 );
	
	if (objectiveType1 != '-' || objectiveType2 != '-' || objectiveType3 != '-') {
		var longBarImage = ImageUtils.get('ebr/images/Horizontal-Bar-Mission-Long.png');
		var longBarRegion = new Region( 0, bodyRegion.y + 10, longBarImage.width, longBarImage.height );
	
		sheet.paintImage( g, longBarImage, longBarRegion);
		
		var centerX = 161;
		var centerY = longBarRegion.y + longBarRegion.height + 98;
		var textHeight = 32;
		var height = 0;
		if (objectiveType1 != '-') {
			height = drawMissionObjective(g, sheet, objectiveTextBox, centerX, centerY, objectiveType1, objectiveName1);
			if (height > textHeight) textHeight = height;
		}
		
		centerX += 214;
		if (objectiveType2 != '-') {
			height = drawMissionObjective(g, sheet, objectiveTextBox, centerX, centerY, objectiveType2, objectiveName2);
			if (height > textHeight) textHeight = height;
		}
		
		centerX += 214;
		if (objectiveType3 != '-') {
			height = drawMissionObjective(g, sheet, objectiveTextBox, centerX, centerY, objectiveType3, objectiveName3);
			if (height > textHeight) textHeight = height;
		}
		
		longBarRegion = new Region( 0, centerY + 105 + textHeight, longBarImage.width, longBarImage.height );
		
		sheet.paintImage( g, longBarImage, longBarRegion);
		
		var offset = longBarRegion.y + longBarRegion.height + 15 - bodyRegion.y;
		var newTextHeight = bodyRegion.height - offset;
		if (newTextHeight < 10) newHeight = 10;
		
		bodyRegion.y += offset;
		bodyRegion.height = newTextHeight;
		
		drawMissionBody( g, diy, sheet, bodyBox, bodyRegion, text2 );
	}
}

function drawMissionObjective(g, sheet, objectiveTextBox, x, y, objectiveType, objectiveName) {
	var objectiveImage = ImageUtils.get('ebr/overlays/missions/Mission-' + objectiveType + '.png');
	var objectiveRegion = new Region(x - objectiveImage.width/2, y - objectiveImage.height/2, objectiveImage.width, objectiveImage.height);
	
	sheet.paintImage( g, objectiveImage, objectiveRegion);
	
	objectiveRegion = new Region(x - 90, y + 95, 184, 80);
	objectiveTextBox.markupText = objectiveName;
	var height = objectiveTextBox.measure( g, objectiveRegion );
	var newY = objectiveTextBox.draw( g, objectiveRegion );
	
	/* What makes sense to use here is objectiveTextBox.measure( g, objectiveRegion );  */
	/* But I ran into a bug where measure returns an absurdly high value and I have no idea why. */
	/* In addition to that, the same bug seems to be causing the draw function to randomly return 0.*/
	/* The fix I have applied here is to calculate the height based off the draw return, but have the */
	/* default height value set (see textHeight in the calling function, so if draw returns 0, */
	/* this function will just return a negative value which will be ignored.*/
	return newY - objectiveRegion.y;
}

function drawMissionBody( g, diy, sheet, bodyBox, bodyRegion, text ) {
	while (text.length > 0) {
		let startMatch = /<objective(\s+([1-9][0-9]?|100))?>/.exec( text );
		let endMatch = null;
		let preSpecialText = '';
		let specialText = '';
		let postSpecialText = '';
		let sectionHeight = 0;
		let textRegion = new Region( bodyRegion ); // TODO: Get rid of this. bodyRegion is for the text and boxRegion is for the image
		
		// Check for tags and handle them accordingly
		if ( startMatch ) {
			endMatch = /<\/objective>\n?/.exec( text );
			
			// If there is text before the tag, draw it first
			if ( startMatch.index > 0) {
				preSpecialText = text.slice( 0, startMatch.index );
				if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<lvs>';
				
				bodyBox.markupText = preSpecialText;
				//bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
				sectionHeight = bodyBox.measure( g, bodyRegion );

				bodyBox.draw( g, bodyRegion );
				bodyBox.markupText = '';
						
				bodyRegion.y += sectionHeight;
				bodyRegion.height -= sectionHeight;
			}
			
			// If there is a closing tag, grab the text between tags,
			// otherwise, grab everything
			if ( endMatch ) {				
				//include the ending tag in the slice
				let len = endMatch[0].length;
				specialText = text.slice( startMatch.index, endMatch.index + len );
				postSpecialText = text.slice( endMatch.index + len );
			}
			else {
				specialText = text.slice( startMatch.index );
			}
			
			// This is the box for drawing the section image
			let boxRegion = new Region( bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height );
			
			//The text needs to be scooched inside the box
			bodyRegion.x += 16;
			bodyRegion.width -= 32;
			bodyRegion.y += 8;
			bodyRegion.height -= 8;
			
			textRegion.x = bodyRegion.x;
			textRegion.y = bodyRegion.y;
			textRegion.width = bodyRegion.width;
			textRegion.height = bodyRegion.height;
			
			// Set the text of the box to the text between tags. measure how tall that text is
			var objectiveTextBox = createTextBox(diy, sheet, 'MissionCard-ChallengeObjectiveText');
			initBodyTags(diy, objectiveTextBox);
			objectiveTextBox.markupText = specialText;
			sectionHeight = objectiveTextBox.measure( g, textRegion );
			// bodyBox.markupText = specialText;
			// sectionHeight = bodyBox.measure( g, textRegion );
			
			// Scale the image box accordingly
			// |----------------w----------------|
			// |~(w-w.s)/2~|---w.s---|~~~~~~~~~~~|
			let scale = 1;
			if (startMatch[2] != null) scale = Number(startMatch[2])/100;
			boxRegion.x += boxRegion.width*(1 - scale)/2;
			boxRegion.width = boxRegion.width*scale;
			
			let boxTopImage = ImageUtils.get('ebr/overlays/missions/MissionObjectiveBox.png');
			let boxBotImage = boxTopImage;
			let boxMidImage = ImageUtils.get('ebr/overlays/missions/MissionObjectiveBoxLine.png');
			
			let ar = boxTopImage.height / boxTopImage.width;

			sheet.paintImage( g, boxTopImage, 
				new Region( boxRegion.x, boxRegion.y, boxRegion.width, bodyRegion.width * ar ) );
				
			boxRegion.y += bodyRegion.width * ar;
			boxRegion.height -= bodyRegion.width * ar;
			
			// If the textbox is bigger than just the top and bottom put together, add the mid section
			let minHeight = 42.7; // Height of the textbox inside the image with just top and bottom
			if ( sectionHeight > minHeight ) {
				sheet.paintImage( g, boxMidImage, 
					new Region( boxRegion.x, boxRegion.y, boxRegion.width, sectionHeight - minHeight ) );
			}
			else if ( sectionHeight < minHeight ) sectionHeight = minHeight;
			
			// Shift the image region down according to the extra amount we added
			boxRegion.y += (sectionHeight - minHeight);
			boxRegion.height -= (sectionHeight - minHeight);

			ar = boxBotImage.height / boxBotImage.width;

			sheet.paintImage( g, ImageUtils.mirror( boxBotImage, false, true ), 
				new Region( boxRegion.x, boxRegion.y, boxRegion.width, bodyRegion.width * ar) );
			
			// var styleBefore = bodyBox.defaultStyle;
			//bodyBox.setDefaultStyle = diy.settings.getTextStyle('MissionCard-ChallengeObjectiveText', null);
			//bodyBox.draw( g, textRegion );
			//bodyBox.markupText = '';
			//bodyBox.defaultStyle = styleBefore;
			objectiveTextBox.draw( g, textRegion );
			objectiveTextBox.markupText = '';
			
			// Return bodyRegion x coordinate to the correct spot
			bodyRegion.x -= 16;
			bodyRegion.width += 32;
			
			// Set bodyRegion y coordinate to a little lower than the bottom of the drawn section
			bodyRegion.y += sectionHeight + 15;
			bodyRegion.height -= (sectionHeight + 15);
			
			text = postSpecialText;
		}
		else {
			// If there is not tag, draw the text and move on
			bodyBox.markupText = text;
			
			sectionHeight = bodyBox.measure( g, bodyRegion );
			bodyBox.draw( g, bodyRegion );
			
			bodyBox.markupText = '';
			bodyRegion.y += sectionHeight;
			bodyRegion.height -= sectionHeight;
		
			text = '';
		}
	}
}

function drawGuidePage(g, diy, sheet, bodyBox, bodyRegion, text) {
	while (text.length > 0) {
		let startMatch = /<textbox(?:\s+indent)?>|<box(?:enters|clearp|cleart|clearh)(?:\s+transparent)>|<greybox(\s+([1-9][0-9]?|100))?>|<choice>/.exec( text );
		let endMatch = null;
		let preSpecialText = '';
		let specialText = '';
		let postSpecialText = '';
		let sectionHeight = 0;
		let boxRegion = null;
		let ar = 0;
		let boxTopImage = null;
		let boxBotImage = null;
		let boxMidImage = null;
		let minHeight = 0;
		
		if ( startMatch ) {
			// If there is text before the tag, draw it first
			if ( startMatch.index > 0) {
				preSpecialText = text.slice( 0, startMatch.index );
				if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<lvs>';
				
				bodyBox.markupText = preSpecialText;
				sectionHeight = bodyBox.measure( g, bodyRegion );

				bodyBox.draw( g, bodyRegion );
				bodyBox.markupText = '';
						
				bodyRegion.y += sectionHeight;
				bodyRegion.height -= sectionHeight;
			}
			
			let tagMatch = /<([a-zA-Z]+)/.exec( startMatch[0] );
			
			switch ( tagMatch[1] ) {
				case 'choice':
					// No text to write here, just a static string
					text = text.slice( startMatch.index + startMatch[0].length );
					
					if (/^(\n|\r)/.test( text )) text = text.slice(1);
					
					// This is the box for drawing the image
					boxRegion = new Region( bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height );
					bodyRegion.y += 4;
					bodyRegion.height -= 4;
					var chooseTextBox = createTextBox(diy, sheet, 'CampaignGuide-Page-ChooseText');
					chooseTextBox.markupText = "RANGERS CHOOSE:"; //TODO: Extract this to a variable for loc
					
					sectionHeight = chooseTextBox.measure( g, bodyRegion );
					
					let chooseBoxImage = ImageUtils.get('ebr/overlays/page/ChooseBox.png');
					ar = chooseBoxImage.height / chooseBoxImage.width;
					
					sheet.paintImage( g, chooseBoxImage, 
						new Region( boxRegion.x, boxRegion.y, boxRegion.width, bodyRegion.width * ar ) );
						
					chooseTextBox.draw( g, bodyRegion );
					
					// Set bodyRegion y coordinate to a little lower than the bottom of the drawn section
					bodyRegion.y += sectionHeight + 5;
					bodyRegion.height -= (sectionHeight + 5);
					break;
				case 'greybox':
					endMatch = /<\/greybox>\n?/.exec( text );
						
					[ specialText, postSpecialText] = getTextFromClosingTag(text, startMatch, endMatch);
					
					// This is the box for drawing the section image
					boxRegion = new Region( bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height );
					bodyRegion.x += 4;
					bodyRegion.width -= 8;
					bodyRegion.y += 4;
					bodyRegion.height -= 4;
					
					// Set the text of the box to the text between tags. measure how tall that text is
					var greyTextBox = createTextBox(diy, sheet, 'CampaignGuide-Page-GreyText');
					initBodyTags(diy, greyTextBox);
					greyTextBox.markupText = specialText;
					sectionHeight = greyTextBox.measure( g, bodyRegion );
					
					boxTopImage = ImageUtils.get('ebr/overlays/page/GreyBox-Top.png');
					boxBotImage = boxTopImage;
					boxMidImage = ImageUtils.get('ebr/overlays/page/GreyBox-Top.png');
					
					ar = boxTopImage.height / boxTopImage.width;

					sheet.paintImage( g, boxTopImage, 
						new Region( boxRegion.x, boxRegion.y, boxRegion.width, bodyRegion.width * ar ) );
						
					boxRegion.y += bodyRegion.width * ar;
					boxRegion.height -= bodyRegion.width * ar;
					
					// If the textbox is bigger than just the top and bottom put together, add the mid section
					minHeight = 32; // Height of the textbox inside the image with just top and bottom
					if ( sectionHeight > minHeight ) {
						sheet.paintImage( g, boxMidImage, 
							new Region( boxRegion.x, boxRegion.y, boxRegion.width, sectionHeight - minHeight ) );
					}
					else if ( sectionHeight < minHeight ) sectionHeight = minHeight;
					
					// Shift the image region down according to the extra amount we added
					boxRegion.y += (sectionHeight - minHeight);
					boxRegion.height -= (sectionHeight - minHeight);
		
					ar = boxBotImage.height / boxBotImage.width;
		
					sheet.paintImage( g, ImageUtils.mirror( boxBotImage, false, true ), 
						new Region( boxRegion.x, boxRegion.y, boxRegion.width, bodyRegion.width * ar) );
					
					greyTextBox.draw( g, bodyRegion );
					greyTextBox.markupText = '';
					
					// Return bodyRegion x coordinate to the correct spot
					bodyRegion.x -= 4;
					bodyRegion.width += 8;
					
					// Set bodyRegion y coordinate to a little lower than the bottom of the drawn section
					bodyRegion.y += sectionHeight + 15;
					bodyRegion.height -= (sectionHeight + 15);
					
					text = postSpecialText;
					break;
				case 'textbox':
					endMatch = /<\/textbox>\n?/.exec( text );
				
					[ specialText, postSpecialText] = getTextFromClosingTag(text, startMatch, endMatch);
					
					// This is the box for drawing the section image
					boxRegion = new Region( bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height );
					bodyRegion.x += 20;
					bodyRegion.width -= 40;
					bodyRegion.y += 8;
					bodyRegion.height -= 8;
					
					// Set the text of the box to the text between tags. measure how tall that text is
					bodyBox.markupText = specialText;
					sectionHeight = bodyBox.measure( g, bodyRegion );
					
					boxTopImage = ImageUtils.get('ebr/overlays/page/TextBox-Top.png');
					boxBotImage = boxTopImage;
					boxMidImage = ImageUtils.get('ebr/overlays/page/TextBox-Middle.png');
					
					ar = boxTopImage.height / boxTopImage.width;

					sheet.paintImage( g, boxTopImage, 
						new Region( boxRegion.x, boxRegion.y, boxRegion.width, bodyRegion.width * ar ) );
						
					boxRegion.y += bodyRegion.width * ar;
					boxRegion.height -= bodyRegion.width * ar;
					
					// If the textbox is bigger than just the top and bottom put together, add the mid section
					minHeight = 20; // Height of the textbox inside the image with just top and bottom
					if ( sectionHeight > minHeight ) {
						sheet.paintImage( g, boxMidImage, 
							new Region( boxRegion.x, boxRegion.y, boxRegion.width, sectionHeight - minHeight ) );
					}
					else if ( sectionHeight < minHeight ) sectionHeight = minHeight;
					
					// Shift the image region down according to the extra amount we added
					boxRegion.y += (sectionHeight - minHeight);
					boxRegion.height -= (sectionHeight - minHeight);
		
					ar = boxBotImage.height / boxBotImage.width;
		
					sheet.paintImage( g, ImageUtils.mirror( boxBotImage, false, true ), 
						new Region( boxRegion.x, boxRegion.y, boxRegion.width, bodyRegion.width * ar) );
					
					bodyBox.draw( g, bodyRegion );
					bodyBox.markupText = '';
					
					// Return bodyRegion x coordinate to the correct spot
					bodyRegion.x -= 20;
					bodyRegion.width += 40;
					
					// Set bodyRegion y coordinate to a little lower than the bottom of the drawn section
					bodyRegion.y += sectionHeight + 15;
					bodyRegion.height -= (sectionHeight + 15);
					
					text = postSpecialText;
					break;
				default:
					
					break;
			}
		}
		else {
			// If there is no tag, draw the text and move on
			bodyBox.markupText = text;
			
			sectionHeight = bodyBox.measure( g, bodyRegion );
			bodyBox.draw( g, bodyRegion );
			
			bodyBox.markupText = '';
			bodyRegion.y += sectionHeight;
			bodyRegion.height -= sectionHeight;
		
			text = '';
		}
	}
}

function getTextFromClosingTag(text, startMatch, endMatch) {
	let specialText = '';
	let postSpecialText = '';
	// If there is a closing tag, grab the text between tags,
	// otherwise, grab everything
	if ( endMatch ) {				
		//include the ending tag in the slice
		let len = endMatch[0].length;
		specialText = text.slice( startMatch.index, endMatch.index + len );
		postSpecialText = text.slice( endMatch.index + len );
	}
	else {
		specialText = text.slice( startMatch.index );
	}

	return [ specialText, postSpecialText];
}