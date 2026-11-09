importClass( ca.cgjennings.graphics.ImageUtilities );
importClass( arkham.diy.ListItem );

useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );


function create( diy ) {
	diy.faceStyle = FaceStyle.PLAIN_BACK;
	diy.frontTemplateKey = "Ranger-Card-Default";
	diy.backTemplateKey = "Ranger-Card-Back-Default";
	diy.portraitKey = "Ranger-Card";
	// TO DO: Extract per-aspect background images from 0.51 PDFs and set as default instead of all-white text
	
	diy.name = '';
	setDefaults();
	
	diy.extensionName = "EarthborneRangers.seext";
	diy.version = 3;
}

function setDefaults() {
	$Aspect = 'Awareness';
	
	$EnergyCost = '-';
	$EquipValue = '0';
	$TokenValue = '-';
	$TokenName = '';
	$Type = '';
	$Traits = '';
	
	$Presence = '-';
	$PresencePerRanger = '0';
	$Harm = '-';
	$HarmPerRanger = '0';
	$Progress = '-';
	$ProgressPerRanger = '0';
	
	$Approach1 = 'None';
	$Approach2 = 'None';
	$Approach3 = 'None';
	$Approach4 = 'None';
	
	$StatReq = '';
	$SetInfo = '<bgcolor #000><white> ABC </white></bgcolor> REWARDS - 1/?';
	
	$CardText = '';
	$TextboxSize = '344';
	$SunEffect = '';
	$MountainEffect = '';
	$CrestEffect = '';
	
	$DrawPortraitOverTitle = '0';
	$DrawPortraitOverRules = '0';
	
	$Artist = '';
	$Copyright = '#EBR-Homebrew';
}

function createInterface( diy, editor ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	let bindings = new Bindings(editor, diy);
	
	///// General Card Info Tab /////
	let generalStack = new Stack();
	
	// Title Panel
	let panel = new Grid("fillx");
	let nameField = textField();
	diy.setNameField(nameField);
	let nameLabel = label("&Name", nameField);
	panel.place(nameLabel, "split", nameField, "growx, wrap");
	panel.setTitle("Title");
	generalStack.add(panel);
	
	// Basic Data Panel
	panel = new Grid("fillx");
	panel.setTitle("Basic Data");
	
	var cardTypeField = textField();
	bindings.add("Type", cardTypeField, [0]);
	panel.place("Card Type", 'align right', cardTypeField, 'pushx, growx, sizegroup sp');
	
	var traitsField = textField();
	bindings.add("Traits", traitsField, [0]);
	panel.place("Traits", 'align right, gapx 10', traitsField, 'wrap, pushx, growx, sizegroup sp');
	
	var aspectList = new comboBox( EBRObject.aspects, null );
	bindings.add("Aspect", aspectList, [0]);
	panel.place("Aspect", 'align right', aspectList, 'pushx, growx, sizegroup sp');
	
	var costList = new comboBox( EBRObject.comboCost, null );
	bindings.add( "EnergyCost", costList, [0] );
	panel.place("Energy Cost", 'align right, gapx 10', costList, 'wrap, pushx, growx, sizegroup sp');
	
	var approachList1 = new comboBox( EBRObject.comboApproach, null );
	bindings.add("Approach1", approachList1, [0]);
	panel.place("Approach Icon 1", 'align right', approachList1, 'pushx, growx, sizegroup sp');
	
	var approachList2 = new comboBox( EBRObject.comboApproach, null );
	bindings.add( "Approach2", approachList2, [0] );
	panel.place("Approach Icon 2", 'align right, gapx 10', approachList2, 'wrap, pushx, growx, sizegroup sp');
	
	var approachList3 = new comboBox( EBRObject.comboApproach, null );
	bindings.add("Approach3", approachList3, [0]);
	panel.place("Approach Icon 3", 'align right', approachList3, 'pushx, growx, sizegroup sp');
	
	var equipValueList = new comboBox( EBRObject.comboEquipValue, null );
	bindings.add( "EquipValue", equipValueList, [0] );
	panel.place("Equip Value", 'align right, gapx 10', equipValueList, 'wrap, pushx, growx, sizegroup sp');
	
	var tokenValueList = new comboBox( EBRObject.comboTokens, null );
	bindings.add("TokenValue", tokenValueList, [0]);
	panel.place("Token Value", 'align right', tokenValueList, 'pushx, growx, sizegroup sp');
	
	var tokenNameField = textField();
	bindings.add("TokenName", tokenNameField, [0]);
	panel.place("Token Name", 'align right, gapx 10', tokenNameField, 'wrap, pushx, growx, sizegroup sp');
	
	generalStack.add(panel);
	
	// Set info panel
	panel = new Grid("fillx");
	panel.setTitle("Set Info");
	
	let setInfoField = textField();
	bindings.add("SetInfo", setInfoField, [0]);
	panel.place("Set Info", "split", setInfoField, "growx, wrap");
	
	let statReqField = textField();
	bindings.add("StatReq", statReqField, [0]);
	panel.place("Stat Requirement", "split", statReqField, "growx, wrap");
	
	let artistField = textField();
	bindings.add("Artist", artistField, [0]);
	panel.place("Artist", "split", artistField, "growx, wrap");
	
	let copyrightField = textField();
	bindings.add("Copyright", copyrightField, [0]);
	panel.place(
		"Copyright", "split", copyrightField, "pushx, growx",
		new tipButton( @( 'EBR-CopyrightTip' ) ), 'aligny top, gaptop 5'
	);
	
	generalStack.add(panel);
	
	// Thresholds Panel
	panel = new Grid("fillx");
	panel.setTitle("Card Thresholds");
	
	var perRangerIcon = ImageUtils.createIcon(ImageUtils.get('ebr/icons/PerRanger.png'), 12, 12);
	
	var presenceList = new comboBox( EBRObject.comboCost, null );
	bindings.add("Presence", presenceList, [0]);
	var perRangerPresenceButton = new toggleButton( '', perRangerIcon, false );
	bindings.add("PresencePerRanger", perRangerPresenceButton, [0] );
	panel.place("Presence", 'align right', presenceList, 'pushx, growx', perRangerPresenceButton, 'wmax 35, hmin 25, hmax 25');
	
	var progressList = new comboBox( EBRObject.comboProgress, null );
	bindings.add("Progress", progressList, [0]);
	var perRangerProgressButton = new toggleButton( '', perRangerIcon, false );
	bindings.add("ProgressPerRanger", perRangerProgressButton, [0] );
	panel.place("Progress", 'align right', progressList, 'pushx, growx', perRangerProgressButton, 'wrap, wmax 35, hmin 25, hmax 25');
	
	var harmList = new comboBox( EBRObject.comboCost, null );
	bindings.add("Harm", harmList, [0]);
	var perRangerHarmButton = new toggleButton( '', perRangerIcon, false );
	bindings.add("HarmPerRanger", perRangerHarmButton, [0] );
	panel.place("Harm", 'align right', harmList, 'pushx, growx', perRangerHarmButton, 'wmax 35, hmin 25, hmax 25');
	
	generalStack.add(panel);
	
	///// Card Text Tab /////
	let contentStack = new Stack();
	panel = new Grid("fillx");
	panel.setTitle("Card Text");
	
	let textboxSizeCounter = spinner( 150, 353 );
	bindings.add("TextboxSize", textboxSizeCounter, [0]);
	panel.place( "Size (150-344)", "wmax 100", textboxSizeCounter, "wrap, spany2, pushx, align left");
	
	let cardTextField = textArea("", 15, 0, true);
	bindings.add("CardText", cardTextField, [0]);
	let cardTextLabel = label("&Card Text", cardTextField);
	panel.place(
		cardTextLabel, "wrap", cardTextField, "spany 2, pushx, growx",
		new tipButton( @( 'EBR-CardTextTip' ) ), 'wrap, aligny top, gaptop 5',
		new tipButton( @( 'EBR-RangerCardTip' ) ), 'wrap, aligny top, gaptop 5'
	);
	
    contentStack.add(panel);
    	
	panel = new Grid("fillx");
	panel.setTitle("Challenge Effects");
	
	let sunEffectField = textArea("", 5, 0, true);
	bindings.add("SunEffect", sunEffectField, [0]);
	panel.place("Sun Effect", "wrap", sunEffectField, "growx, wrap");
	
	let mountainEffectField = textArea("", 5, 0, true);
	bindings.add("MountainEffect", mountainEffectField, [0]);
	panel.place("Mountain Effect", "wrap", mountainEffectField, "growx, wrap");
	
	let crestEffectField = textArea("", 5, 0, true);
	bindings.add("CrestEffect", crestEffectField, [0]);
	panel.place("Crest Effect", "wrap", crestEffectField, "growx, wrap");
	
	contentStack.add(panel);
    
    // Add all tabs to the editor in reverse display order
    
    contentStack.editorTabScrolling = true;
    contentStack.addToEditor(editor, "Content", null, null, 0);
    
    generalStack.editorTabScrolling = true;
    generalStack.addToEditor(editor, "General", null, null, 0);
    
    bindings.bind();
}

let titleBox, costBox, aspectBox, typeBox, tokenValueBox, tokenNameBox, setInfoTextBox, statReqTextBox,
	  presenceTextBox, presencePerRangerTextBox, progressTextBox, progressPerRangerTextBox, harmTextBox, harmPerRangerTextBox, 
	  textBox, challengeTextBox, artistTextBox, copyrightTextBox;

function createFrontPainter( diy, sheet ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	// TO DO: Make function for initializing a text box
	titleBox = createTextBox(diy, sheet, 'Ranger-Card-Title');
    //titleBox.setTextFitting(MarkupBox.FIT_BOTH);
    
    costBox = createTextBox(diy, sheet, 'Ranger-Card-Cost');
	
	aspectBox = createTextBox(diy, sheet, 'Ranger-Card-Aspect');
	
	typeBox = createTextBox(diy, sheet, 'Ranger-Card-Type');
	
	tokenValueBox = createTextBox(diy, sheet, 'Ranger-Card-Token-Value');
	
	tokenNameBox = createTextBox(diy, sheet, 'Ranger-Card-Token-Name');
	
	presenceTextBox = createTextBox(diy, sheet, 'Ranger-Card-Threshold-Text');
	
	presencePerRangerTextBox = createTextBox(diy, sheet, 'Ranger-Card-Threshold-PerRanger-Text');
	
	progressTextBox = createTextBox(diy, sheet, 'Ranger-Card-Threshold-Text');
	
	progressPerRangerTextBox = createTextBox(diy, sheet, 'Ranger-Card-Threshold-PerRanger-Text');
	
	harmTextBox = createTextBox(diy, sheet, 'Ranger-Card-Threshold-Text');
	
	harmPerRangerTextBox = createTextBox(diy, sheet, 'Ranger-Card-Threshold-PerRanger-Text');
	
	setInfoTextBox = createTextBox(diy, sheet, 'Ranger-Card-Set-Info');
	
	statReqTextBox = createTextBox(diy, sheet, 'Ranger-Card-Stat-Req');
    
    textBox = createTextBox(diy, sheet, 'Ranger-Card-Text');
	//textBox.setTextFitting(MarkupBox.FIT_BOTH);
	
	challengeTextBox = createTextBox(diy, sheet, 'Ranger-Card-Challenge');
	
	artistTextBox = createTextBox(diy, sheet, 'Ranger-Card-Artist');
	
	copyrightTextBox = createTextBox(diy, sheet, 'Ranger-Card-Copyright');
	
	initCopyrightTags(diy, copyrightTextBox);
	initBodyTags(diy, textBox);
	initBodyTags(diy, challengeTextBox);
	initRangerCardBodyTags(diy, textBox);
	initRangerCardBodyTags(diy, challengeTextBox);
	initBodyStyleTags(diy, progressTextBox);
	initBodyStyleTags(diy, challengeTextBox);
}

function createBackPainter( diy, sheet ) {}


function paintFront( g, diy, sheet ) {
	var EBRObject = Eons.namedObjects.EBRObject;
	
	sheet.paintPortrait(g);
	
	// Paint Template Image
	var image = ImageUtils.get('ebr/templates/Empty-' + getAspectAbbreviation($Aspect) + '-Card.png');
	var w = image.getWidth();
	var h = image.getHeight();
	sheet.paintImage( g, image, new Region(0, 0, w, h) );
	
	//Paint Textbox Frame
	var totalOffset = parseInt($Ranger-Card-Challenge-Height) * countChallengeEffects([ $SunEffect, $MountainEffect, $CrestEffect ]);
	if(countChallengeEffects([ $SunEffect, $MountainEffect, $CrestEffect ]) != 0) {
		totalOffset += 2;
	}
	var heightDifference = 344 - parseInt($TextboxSize);
	var startX = 89;
	var startY = 659 - totalOffset + heightDifference;
	var textboxBackground = ImageUtils.get('ebr/overlays/ranger/' + $Aspect + '-textbox-background.png');
	textboxBackground = ImageUtils.crop(textboxBackground, 0, 0, textboxBackground.getWidth(), $TextboxSize);
	sheet.paintImage( g, textboxBackground, new Region(startX, startY, textboxBackground.getWidth(), $TextboxSize) );
	
	//Draw ornate frame pieces that don't scale well
	var textboxFrameBottom = ImageUtils.get('ebr/overlays/ranger/ranger-textbox-frame-bottom.png');
	textboxFrameBottom = ImageUtils.tint(textboxFrameBottom, getAspectTintForFrame($Aspect));
	sheet.paintImage( 
		g, 
		textboxFrameBottom, 
		new Region( startX - 22, startY + parseInt($TextboxSize) + 3 - textboxFrameBottom.getHeight(), textboxFrameBottom.getWidth(), textboxFrameBottom.getHeight()) 
	);
	var textboxFrameTop = ImageUtils.get('ebr/overlays/ranger/ranger-textbox-frame-top.png');
	textboxFrameTop = ImageUtils.tint(textboxFrameTop, getAspectTintForFrame($Aspect));
	sheet.paintImage( g, textboxFrameTop, new Region( startX - 4, startY - 5, textboxFrameTop.getWidth(), textboxFrameTop.getHeight()) );
	
	// Connect the top and bottom halves of the frame together with vertical bars
	var textboxJoiner = ImageUtils.get('ebr/overlays/ranger/textbox-joiner.png');
	textboxJoiner = ImageUtils.tint(textboxJoiner, getAspectTintForFrame($Aspect));
	sheet.paintImage( g, textboxJoiner, new Region( startX - 5, startY - 4, 5, parseInt($TextboxSize) + 5) );
	sheet.paintImage( g, textboxJoiner, new Region( startX + 7, 655 - totalOffset + heightDifference, 2, parseInt($TextboxSize) - 18) );
	sheet.paintImage( g, textboxJoiner, new Region( startX + textboxBackground.getWidth(), startY - 4, 4, parseInt($TextboxSize) + 7) );
	sheet.paintImage( g, textboxJoiner, new Region( startX + textboxBackground.getWidth() - 12, startY + 106, 6, parseInt($TextboxSize) - 105) );
	sheet.paintImage( g, textboxJoiner, new Region( 715, 186, 8, 581 - totalOffset + heightDifference) );
	sheet.paintImage( g, textboxJoiner, new Region( 76, startY + parseInt($TextboxSize) - 76, 2, parseInt($TextboxSize) + totalOffset + 76) 
	);
	
	g.setPaint(Color.BLACK);

	// Draw Card Text
	textBox.markupText = $CardText;
	textBox.setLineTightness(EBRObject.bodyFontTightness);
	var region = $$Ranger-Card-Text-region.region;
	region.y = region.y - totalOffset + heightDifference;
	region.height = region.height - heightDifference;
	textBox.draw(g, region);

	// Draw Title
	titleBox.markupText = diy.name;
	var rangerCardTitleRegion = $$Ranger-Card-Title-region.region;
	if ($Presence != '-') {
		rangerCardTitleRegion.width -= 50;
	}
	titleBox.draw(g, rangerCardTitleRegion);
	
	// Draw Energy
	if ($EnergyCost != '-') {
		costBox.markupText = $EnergyCost;
		costBox.draw(g, $$Ranger-Card-Cost-region.region);
		aspectBox.markupText = getAspectAbbreviation($Aspect);
		aspectBox.draw(g, $$Ranger-Card-Aspect-region.region);
	}
	
	// Draw Type and Traits
	var typeText = $Type;
	if($Traits != '') {
		typeText = typeText + ' <i>/ ' + $Traits + '</i>';
	}
	typeBox.markupText = typeText;
	var rangerCardTypeRegion = $$Ranger-Card-Type-region.region;
	if ($Presence != '-') {
		rangerCardTypeRegion.width -= 50;
	}
	typeBox.draw(g, rangerCardTypeRegion);
	
	// Draw Equip Value pips
	for ( var eIndex = 1; eIndex <= $EquipValue; eIndex++ ) {
		sheet.paintImage( g, ImageUtils.get('ebr/overlays/' + $Aspect + '-Equip-Icon-Full.png'),
				diy.settings.getRegion('Ranger-Card-Equip-Value-Icon' + eIndex));
	}
	if ($EquipValue > 0) {
		for (; eIndex <= EBRObject.maxEquipValue; eIndex++ ) {
			sheet.paintImage( g, ImageUtils.get('ebr/overlays/' + $Aspect + '-Equip-Icon-Empty.png'),
				diy.settings.getRegion('Ranger-Card-Equip-Value-Icon' + eIndex));
		}
	}
	
	// Draw Approach Icons
	var maxIcons = 3;
	for ( let index = 1; index <= maxIcons; index++ ) {
		let iconName = $('Approach' + index);
		if ( iconName != 'None' ) {
			sheet.paintImage( g, ImageUtils.get('ebr/overlays/Commit-' + iconName + '.png'), 
				diy.settings.getRegion('Ranger-Card-Commit-Icon' + index));
		}
	}
	
	// Draw Token Box
	if ($TokenValue != '-') {
		// TO DO: Figure out how to change the name color by aspect
		sheet.paintImage( g, ImageUtils.get('ebr/overlays/' + $Aspect + '-Token-Box.png'), $$Ranger-Card-Token-Box-region.region );
		tokenValueBox.markupText = $TokenValue;
		tokenValueBox.draw(g, $$Ranger-Card-Token-Value-region.region);
		tokenNameBox.markupText = $TokenName;
		tokenNameBox.draw(g, $$Ranger-Card-Token-Name-region.region);
	}
	
	// Draw Threshold boxes
	if ($Presence != '-') {
		drawThresholdValue(g, diy, sheet, $Aspect, 'Presence', 'Presence', presenceTextBox, presencePerRangerTextBox, 0);
	}
	
	var harmRegionName = 'Threshold1';
	if ($Progress != '-') {
		harmRegionName = 'Threshold2';
		drawThresholdValue(g, diy, sheet, $Aspect, 'Progress', 'Threshold1', progressTextBox, progressPerRangerTextBox, 0);
	}
	if ($Harm != '-') {
		drawThresholdValue(g, diy, sheet, $Aspect, 'Harm', harmRegionName, harmTextBox, harmPerRangerTextBox, 0);
	}
	
	// Draw Set Info
	setInfoTextBox.markupText = $SetInfo;
	drawRotatedTextBox(g, $$Ranger-Card-Set-Info-region.region, setInfoTextBox);
	
	// Draw Stat Requirement
	statReqTextBox.markupText = $StatReq;
	drawRotatedTextBox(g, $$Ranger-Card-Stat-Req-region.region, statReqTextBox);
	
	// Draw challenge boxes
	drawChallengeEffects(g, diy, sheet, 'Ranger', [ $SunEffect, $MountainEffect, $CrestEffect ]);
	
	// Draw Artist credit
	artistTextBox.markupText = $Artist;
	artistTextBox.draw(g, $$Ranger-Card-Artist-region.region);
	
	// Draw Copyright
	copyrightTextBox.markupText = $Copyright;
	copyrightTextBox.draw(g, $$Ranger-Card-Copyright-region.region);
}

function paintBack( g, diy, sheet ) {}

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy) {
	if(diy.version < 2) {
		$TextboxSize = '344';
		$SunEffect = '';
		$MountainEffect = '';
		$CrestEffect = '';
		diy.setVersion(2);
	}
	if(diy.version < 3) {
		$DrawPortraitOverTitle = '0';
		$DrawPortraitOverRules = '0';
		diy.setVersion(3);
	}
}

function onWrite() {}

// This is part of the diy library; calling it from within a
// script that defines the needed functions for a DIY component
// will create the DIY from the script and add it as a new editor;
// however, saving and loading the new component won't work correctly.
// This means you can test your script directly by running it without
// having to create a plug-in (except to make any required resources
// available).
if( sourcefile == 'Quickscript' ) {
	useLibrary('project:EarthborneRangers/resources/ebr/diy/libraries/EBR-utilLibrary.js');
	useLibrary('project:EarthborneRangers/resources/ebr/diy/libraries/EBR-layoutLibrary.js');
	useLibrary('project:EarthborneRangers/resources/ebr/diy/libraries/EBR-drawLibrary.js');
	
	testDIYScript();
}
else {
	useLibrary('res://ebr/diy/libraries/EBR-utilLibrary.js');
	useLibrary('res://ebr/diy/libraries/EBR-layoutLibrary.js');
	useLibrary('res://ebr/diy/libraries/EBR-drawLibrary.js');
}