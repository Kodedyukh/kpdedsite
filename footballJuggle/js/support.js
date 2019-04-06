function tweenTint(object, startColor, endColor, time) {
	var colorBlend = {step: 0};
	var colorTween = game.add.tween(colorBlend).to({step: 100}, time);
	colorTween.onUpdateCallback(function(){
		object.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
	}, this);
	object.tint = startColor;
	colorTween.start();
}