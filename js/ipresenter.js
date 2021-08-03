/**
 * jQuery-Plugin "iPresenter"
 * 
 * @version: 2.0, 24.05.2012
 * @version: 1.1, 19.04.2012
 * @version: 1.0, 21.03.2012
 * 
 * @author: Hemn Chawroka
 *          http://www.iprodev.com/
 * 
 */

(function($) {

	// Begin the iPresenter plugin
	$.fn.iPresenter = function(opt) {

		// Default settings. Play carefully.
		opt = jQuery.extend({
			easing: 'ease-in-out',
			autoPlay: true,
			replay: true,
			animSpeed: 1000,
			pauseTime: 5000,
			directionNav: true,
			directionNavHoverOpacity: 0.6,
			controlNav: false,
			controlNavNextPrev: true,
			controlNavHoverOpacity: 0.6,
			controlNavThumbs: false,
			controlNavTooltip: true,
			keyboardNav: true,
			touchNav: true,
			pauseOnHover: false,
			itemsOpacity: 0.4,
			nextLabel: "Next",
			previousLabel: "Previous",
			playLabel: "Play",
			pauseLabel: "Pause",
			randomStart: false,
			startStep: 1,
			timer: 'Pie',
			timerBg: '#333',
			timerColor: '#FFF',
			timerOpacity: 0.2,
			timerDiameter: 35,
			timerPadding: 4,
			timerStroke: 3,
			timerBarStroke: 1,
			timerBarStrokeColor: '#FFF',
			timerBarStrokeStyle: 'solid',
			timerBarStrokeRadius: 4,
			timerPosition: 'top-right',
			onPlay:function(){},
			onPause:function(){},
			onAfterLoad:function(){},
			onBeforeChange:function(){},
			onAfterChange:function(){},
			onSlideshowEnd:function(){},
			onLastStep:function(){}
		}, opt);
		
		var el = $(this),
		parentEl = $(el[0].parentNode),
		steps = $('.step', el);

		//Disable text selection
		disableSelection(parentEl[0]);
		
		//Necessary variables
		var defs = {
			total: steps.length,
			images: [],
			timer: null,
			play: false,
			index: 1,
			width: parentEl.width(),
			height: parentEl.height(),
			easing: 'ease-in-out',
			lock: false,
			arcPath: {
				color: opt.timerColor,
				size: parseInt(opt.timerStroke),
				diameter: parseInt(opt.timerDiameter),
				radius: parseInt(opt.timerDiameter - (opt.timerPadding*2) - (opt.timerStroke))
			},
			arcBgPath: {
				color: opt.timerBg,
				size: parseInt(opt.timerStroke + (opt.timerPadding*2)),
				diameter: parseInt(opt.timerDiameter),
				radius: parseInt(opt.timerDiameter - (opt.timerStroke + (opt.timerPadding*2)))
			},
			circlePath: {
				color: opt.timerBg,
				diameter: parseInt(opt.timerDiameter),
				radius: parseInt(opt.timerDiameter-1)
			},
			segmentPath: {
				color: opt.timerColor,
				diameter: parseInt(opt.timerDiameter),
				radius: parseInt(opt.timerDiameter - (opt.timerPadding*2)-1)
			},
			time: opt.pauseTime,
			degree: 0
		};
		
		//Find images
		var images = $('img', el);
		images.each(function(i) {
			var image = $(this);
			defs.images.push(image.attr("src"));
			if(image.data("thumbnail")) defs.images.push(image.data("thumbnail"));
		});
		steps.each(function(i) {
			if($(this).data("thumbnail")) defs.images.push($(this).data("thumbnail"));
		});
		
		//If randomStart
		opt.startStep = (opt.randomStart) ? Math.floor(Math.random() * defs.total) : opt.startStep;
		
		//Set startStep
		opt.startStep = (opt.startStep > 0 && opt.startStep >= defs.total) ? defs.total : opt.startStep;
		defs.index = opt.startStep;

		//Set initial pauseTime
		defs.time = (steps.eq(defs.index-1).data('pausetime')) ? steps.eq(defs.index-1).data('pausetime') : opt.pauseTime;
		
		// HELPER FUNCTIONS
		
		var transorm3dSupport = function() {
			var props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'],
			i = 0,
			support = false,
			form = document.createElement('form');

			while (props[i]) {
				if (props[i] in form.style) {
					support = true;
					break;
				}
				i++;
			} 
			return support;
		}

		var translate = function ( t ) {
			if (!transorm3dSupport()) return " translate(" + t.x + "px," + t.y + "px) ";
			else return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
		};
    
		var rotate = function ( r, revert ) {
			var rX = " rotateX(" + r.x + "deg) ",
				rY = " rotateY(" + r.y + "deg) ",
				rZ = " rotateZ(" + r.z + "deg) ";

			if (!transorm3dSupport()) return " rotate(" + r.z + "deg) ";
			else return revert ? rZ + rY + rX : rX + rY + rZ;
		};
    
		var scale = function ( s ) {
			return " scale(" + s + ") ";
		};

		var stepData = function ( el ) {
			return {
				translate: {
					x: el.data('x') || 0,
					y: el.data('y') || 0,
					z: el.data('z') || 0
				},
				rotate: {
					x: el.data('rotatex') || 0,
					y: el.data('rotatey') || 0,
					z: el.data('rotatez') || el.data('rotate') || 0
				},
				scale: el.data('scale') || 1
			};
		};

		//Set easing timing function
		var setEasing = function(ease){
			ease = $.trim(ease);

			switch(ease){
				case 'linear'		:	ease = 'cubic-bezier(0.250, 0.250, 0.750, 0.750)'; break;
				case 'ease'		:	ease = 'cubic-bezier(0.250, 0.100, 0.250, 1.000)'; break;
				case 'ease-in'		:	ease = 'cubic-bezier(0.420, 0.000, 1.000, 1.000)'; break;
				case 'ease-out'		:	ease = 'cubic-bezier(0.000, 0.000, 0.580, 1.000)'; break;
				case 'ease-in-out'	:	ease = 'cubic-bezier(0.420, 0.000, 0.580, 1.000)'; break;
				case 'ease-out-in'	:	ease = 'cubic-bezier(0.000, 0.420, 1.000, 0.580)'; break;
				case 'easeInQuad'	:	ease = 'cubic-bezier(0.550, 0.085, 0.680, 0.530)'; break;
				case 'easeInCubic'	:	ease = 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'; break;
				case 'easeInQuart'	:	ease = 'cubic-bezier(0.895, 0.030, 0.685, 0.220)'; break;
				case 'easeInQuint'	:	ease = 'cubic-bezier(0.755, 0.050, 0.855, 0.060)'; break;
				case 'easeInSine'	:	ease = 'cubic-bezier(0.470, 0.000, 0.745, 0.715)'; break;
				case 'easeInExpo'	:	ease = 'cubic-bezier(0.950, 0.050, 0.795, 0.035)'; break;
				case 'easeInCirc'	:	ease = 'cubic-bezier(0.600, 0.040, 0.980, 0.335)'; break;
				case 'easeInBack'	:	ease = 'cubic-bezier(0.600, -0.280, 0.735, 0.045)'; break;
				case 'easeOutQuad'	:	ease = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)'; break;
				case 'easeOutCubic'	:	ease = 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'; break;
				case 'easeOutQuart'	:	ease = 'cubic-bezier(0.165, 0.840, 0.440, 1.000)'; break;
				case 'easeOutQuint'	:	ease = 'cubic-bezier(0.230, 1.000, 0.320, 1.000)'; break;
				case 'easeOutSine'	:	ease = 'cubic-bezier(0.390, 0.575, 0.565, 1.000)'; break;
				case 'easeOutExpo'	:	ease = 'cubic-bezier(0.190, 1.000, 0.220, 1.000)'; break;
				case 'easeOutCirc'	:	ease = 'cubic-bezier(0.075, 0.820, 0.165, 1.000)'; break;
				case 'easeOutBack'	:	ease = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'; break;
				case 'easeInOutQuad'	:	ease = 'cubic-bezier(0.455, 0.030, 0.515, 0.955)'; break;
				case 'easeInOutCubic'	:	ease = 'cubic-bezier(0.645, 0.045, 0.355, 1.000)'; break;
				case 'easeInOutQuart'	:	ease = 'cubic-bezier(0.770, 0.000, 0.175, 1.000)'; break;
				case 'easeInOutQuint'	:	ease = 'cubic-bezier(0.860, 0.000, 0.070, 1.000)'; break;
				case 'easeInOutSine'	:	ease = 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'; break;
				case 'easeInOutExpo'	:	ease = 'cubic-bezier(1.000, 0.000, 0.000, 1.000)'; break;
				case 'easeInOutCirc'	:	ease = 'cubic-bezier(0.785, 0.135, 0.150, 0.860)'; break;
				case 'easeInOutBack'	:	ease = 'cubic-bezier(0.680, 0, 0.265, 1)'; break;
			};
			return ease;
		};

		var drawArc = function(ctx, angle, path){
			var startingAngle = degreesToRadians(0),
			endingAngle = degreesToRadians(angle),
			c = Math.round(path.diameter/2);

			//360Bar
			ctx.beginPath();
			ctx.arc(c, c, path.radius/2, startingAngle, endingAngle, false);
			ctx.lineWidth = path.size;
			ctx.strokeStyle = path.color;
			ctx.lineCap = "round";
			ctx.stroke();
			ctx.closePath();
		};

		var drawSegment = function(ctx, angle, path){
			var startingAngle = degreesToRadians(0),
			endingAngle = degreesToRadians(angle),
			c = Math.round(path.diameter/2);

			//Pie
			ctx.beginPath();
			ctx.moveTo(c, c);
			ctx.arc(c, c, path.radius/2, startingAngle, endingAngle, false);
			ctx.fillStyle = path.color;
			ctx.fill();
			ctx.closePath();
		};

		var degreesToRadians = function(degrees) {
			return ((degrees-90) * Math.PI)/180;
		};

		var processTimer = function(ctx){
			if(ctx) ctx.clearRect(0,0,opt.timerDiameter,opt.timerDiameter);
			if(opt.timer.toLowerCase() == "360bar") {
				drawArc(ctx, 360, defs.arcBgPath);
				drawArc(ctx, defs.degree, defs.arcPath);
			}
			else if(opt.timer.toLowerCase() == "pie") {
				drawSegment(ctx, 360, defs.circlePath);
				drawSegment(ctx, defs.degree, defs.segmentPath);
			} else {
				timerBar.css({ width: ((defs.degree/360)*100)+'%' });
			}
			defs.degree += 2;
		};

		//Set initial easing
		defs.easing = setEasing(opt.easing);

		var props = {
			position: "absolute",
			'-webkit-transform-origin': "0% 0%",
			'-webkit-transition': "all 0s "+defs.easing,
			'-webkit-transform-style': "preserve-3d",
			'-webkit-perspective': "1000px",
			'-moz-transform-origin': "0% 0%",
			'-moz-transition': "all 0s "+defs.easing,
			'-moz-transform-style': "preserve-3d",
			'-moz-perspective': "1000px",
			'-o-transform-origin': "0% 0%",
			'-o-transition': "all 0s "+defs.easing,
			'-o-transform-style': "preserve-3d",
			'-o-perspective': "1000px",
			'-ms-transform-origin': "0% 0%",
			'-ms-transition': "all 0s "+defs.easing,
			'-ms-transform-style': "preserve-3d",
			'-ms-perspective': "1000px",
			'transform-origin': "0% 0%",
			'transition': "all 0s "+defs.easing,
			'transform-style': "preserve-3d",
			'perspective': "1000px",
			top: "50%",
			left: "50%"
		};

		// Append necessary elements
		el.append('<div id="content"></div><div id="preloader"><div></div></div>');
		parentEl.append('<canvas id="ipresenter-timer" width="'+opt.timerDiameter+'" height="'+opt.timerDiameter+'"><div></div></canvas>');

		//Add Direction nav
		if(opt.directionNav) parentEl.append("<a class='ipresenter_stepsNav' title='"+opt.nextLabel+"' id='ipresenter_nextStep'></a><a class='ipresenter_stepsNav' title='"+opt.previousLabel+"' id='ipresenter_prevStep'></a>");

		//Add Control nav
		if(opt.controlNav){
			var controlNav = '<div class="ipresenter-controlNav">';
			if(opt.controlNavNextPrev) controlNav += '<a class="ipresenter-controlPrevNav" title="'+ opt.previousLabel +'">'+ opt.previousLabel +'</a>';
			controlNav += '<div class="ipresenter-items"><ul>';
			for(var i = 0; i < defs.total; i++){
				var step = steps.eq(i);
				if(opt.controlNavThumbs){
					var thumb = step.data('thumbnail');
					controlNav += '<li><a class="ipresenter-control" rel="'+ (i+1) +'"><img src="'+ thumb + '" /></a></li>';
				} else {
					var thumb = step.data('thumbnail');
					controlNav += '<li><a class="ipresenter-control" rel="'+ (i+1) +'">'+ (i + 1) +'</a>';
					if(opt.controlNavTooltip) controlNav += '<div class="ipresenter-tooltip"><div><img src="'+thumb+'" /></div></div>';
					controlNav += '</li>';
				}
			}
			controlNav += '</ul></div>';
			if(opt.controlNavNextPrev) controlNav += '<a class="ipresenter-controlNextNav" title="'+ opt.nextLabel +'">'+ opt.nextLabel +'</a>';
			controlNav += '</div>';
				
			parentEl.append(controlNav);
				
			//Set initial active link
			$('.ipresenter-controlNav a.ipresenter-control:eq('+ (defs.index-1) +')', parentEl).addClass('active');
		}

		if(opt.timer.toLowerCase() == "bar") $('#ipresenter-timer').replaceWith('<div id="ipresenter-timer">'+$('#ipresenter-timer').html()+'</div>');

		var content = $('#content', el),
		preloader = $('#preloader', el),
		preloaderBar = $('#preloader div', el),
		timer = $('#ipresenter-timer', parentEl),
		timerBar = $('div', timer);
		if(opt.timer.toLowerCase() != "bar") ctx = timer[0].getContext("2d");
		else ctx = null;

		steps.appendTo(content);
		$('a.ipresenter_stepsNav').hide();

		timer.css({ cursor: 'pointer', 'z-index':'1000', position: 'absolute', opacity: opt.timerOpacity }).hide();
		if(opt.timer.toLowerCase() == "bar") {
			timer.css({ opacity: opt.timerOpacity, borderRadius: opt.timerBarStrokeRadius+'px', width:opt.timerDiameter, height:opt.timerStroke, border:opt.timerBarStroke+'px '+opt.timerBarStrokeColor+' '+opt.timerBarStrokeStyle, padding:opt.timerPadding, background:opt.timerBg });
			timerBar.css({ borderRadius: (opt.timerBarStrokeRadius-1)+'px', width:0, height:opt.timerStroke, background:opt.timerColor, 'float':'left' });
		}

		//Set Timer Position
		var position = opt.timerPosition.toLowerCase().split('-');
		for(var i=0; i < position.length; i++){
			if(position[i]=='top') { timer.css({ top:'10px', bottom:'' }); }
			if(position[i]=='middle') { timer.css({ top:((defs.height/2)-(opt.timerDiameter/2))+'px', bottom:'' }); }
			if(position[i]=='bottom') { timer.css({ bottom:'10px', top:'' }); }
			if(position[i]=='left') { timer.css({ left:'10px', right:'' }); }
			if(position[i]=='center') { timer.css({ left:((defs.width/2)-(opt.timerDiameter/2))+'px', right:'' }); }
			if(position[i]=='right') { timer.css({ right:'10px', left:'' }); }
		}

		el.css(props);
		content.css(props);
        
		var current = {
			translate: { x: 0, y: 0, z: 0 },
			rotate: { x: 0, y: 0, z: 0 },
			scale: 1
		};

		// loop each step and affect transform styles
		steps.each(function(i){
			var offset = $(this),
			data = stepData(offset),
			props = {
				position : 'absolute',
				'-webkit-transform' : 'translate(-50%,-50%)' + translate(data.translate) + rotate(data.rotate) + scale(data.scale)+'',
				'-webkit-transform-style' : 'preserve-3d',
				'-moz-transform' : 'translate(-50%,-50%)' + translate(data.translate) + rotate(data.rotate) + scale(data.scale)+'',
				'-moz-transform-style' : 'preserve-3d',
				'-o-transform' : 'translate(-50%,-50%)' + translate(data.translate) + rotate(data.rotate) + scale(data.scale)+'',
				'-o-transform-style' : 'preserve-3d',
				'-ms-transform' : 'translate(-50%,-50%)' + translate(data.translate) + rotate(data.rotate) + scale(data.scale)+'',
				'-ms-transform-style' : 'preserve-3d',
				'transform' : 'translate(-50%,-50%)' + translate(data.translate) + rotate(data.rotate) + scale(data.scale)+'',
				'transform-style' : 'preserve-3d',
				opacity: opt.itemsOpacity
			};

			offset.css(props).attr('step', i+1);
			if(i==0) offset.css({ opacity: 1 });
		}).hide();

		var transformEnd = function(){
			defs.lock = false;

			timer.animate({ opacity: opt.timerOpacity });

			//Set step pauseTime
			defs.time = (steps.eq(defs.index-1).data('pausetime')) ? steps.eq(defs.index-1).data('pausetime') : opt.pauseTime;

			if(defs.timer==null && defs.play) setTimer();

			//Trigger the onAfterChange callback
			opt.onAfterChange.call(this);

		},

		// Step switcher function
		goStep = function(t, motionless){
			defs.lock = true;

			//Set step active link
			$('.ipresenter-controlNav a.ipresenter-control', parentEl).removeClass("active").eq(t-1).addClass('active');

			//Trigger the onBeforeChange callback
			opt.onBeforeChange.call(this);
			timer.animate({ opacity: 0 }, function() { processTimer(ctx); });

			var step = steps.eq(t-1),
			data = stepData(step),
			active = step.hasClass('active');

			//Custom easing as defined by "data-easing" attribute
			defs.easing = (step.data('easing')) ? setEasing($.trim(step.data('easing'))) : setEasing(opt.easing);

			// making given step active
			steps.removeClass('active');
			step.addClass('active');

			var target = {
				rotate: {
					x: -parseInt(data.rotate.x, 10),
					y: -parseInt(data.rotate.y, 10),
					z: -parseInt(data.rotate.z, 10)
				},
				translate: {
					x: -data.translate.x,
					y: -data.translate.y,
					z: -data.translate.z
				},
				scale: 1 / parseFloat(data.scale)
			};
            
			// check if the transition is zooming in or not
			var zoomin = target.scale >= current.scale;
            
			// if presentation starts (nothing is active yet)
			// don't animate (set duration to 0)
			var duration = (!active && !motionless) ? (opt.animSpeed/1000)+"s" : "0",

			idelay = (zoomin ? (opt.animSpeed/2)+"ms" : "0ms"),
			cdelay = (zoomin ? "0ms" : (opt.animSpeed/2)+"ms"),

			// to keep the perspective look similar for different scales
			// we need to 'scale' the perspective, too
			perspective = (data.scale * 1000) + "px",
			itransform = scale(target.scale),
			ctransform = rotate(target.rotate, true) + translate(target.translate);

			if(!active && defs.lock) setTimeout(transformEnd, opt.animSpeed);

			if(!motionless) {
				steps.animate({ opacity: opt.itemsOpacity }, opt.animSpeed/2);
				step.animate({ opacity: 1 }, opt.animSpeed/1.3);
			} else {
				steps.css({ opacity: opt.itemsOpacity });
				step.css({ opacity: 1 });
			}

			el.css({
				'-webkit-perspective': perspective,
				'-webkit-transform': itransform,
				'-webkit-transition-duration': duration,
				'-webkit-transition-delay': idelay,
				'-webkit-transition-timing-function': defs.easing,
				'-moz-perspective': perspective,
				'-moz-transform': itransform,
				'-moz-transition-duration': duration,
				'-moz-transition-delay': idelay,
				'-moz-transition-timing-function': defs.easing,
				'-o-perspective': perspective,
				'-o-transform': itransform,
				'-o-transition-duration': duration,
				'-o-transition-delay': idelay,
				'-o-transition-timing-function': defs.easing,
				'-ms-perspective': perspective,
				'-ms-transform': itransform,
				'-ms-transition-duration': duration,
				'-ms-transition-delay': idelay,
				'-ms-transition-timing-function': defs.easing,
				'perspective': perspective,
				'transform': itransform,
				'transition-duration': duration,
				'transition-delay': idelay,
				'transition-timing-function': defs.easing
			});

			content.css({
				'-webkit-transform': ctransform,
				'-webkit-transition-duration': duration,
				'-webkit-transition-delay': cdelay,
				'-webkit-transition-timing-function': defs.easing,
				'-moz-transform': ctransform,
				'-moz-transition-duration': duration,
				'-moz-transition-delay': cdelay,
				'-moz-transition-timing-function': defs.easing,
				'-o-transform': ctransform,
				'-o-transition-duration': duration,
				'-o-transition-delay': cdelay,
				'-o-transition-timing-function': defs.easing,
				'-ms-transform': ctransform,
				'-ms-transition-duration': duration,
				'-ms-transition-delay': cdelay,
				'-ms-transition-timing-function': defs.easing,
				'transform': ctransform,
				'transition-duration': duration,
				'transition-delay': cdelay,
				'transition-timing-function': defs.easing
			});
			defs.index = t;
		},

		// Timer interval caller
		timerCall = function() {
			processTimer(ctx);
			if(defs.degree > 360) {
				clearTimer();
				goNext();
			}
		},

		//Set the timer function
		setTimer = function(){
			defs.timer = setInterval(timerCall, (defs.time/180));
		},

		//Clean the timer function
		clearTimer = function(){
			clearInterval(defs.timer);
			defs.timer = null;
			defs.degree = 0;
		},
		playSteps = function(){
			defs.play = true;
			setTimer();
			timer.removeClass('pause').addClass('play').attr('title', opt.pauseLabel);

			//Set initial timer
			timer.css('display', 'block');
			processTimer(ctx);

			//Trigger the onPlay callback
			opt.onPlay.call(this);
		},
		stopSteps = function(){
			defs.play = false;
			clearInterval(defs.timer);
			defs.timer = null;
			timer.removeClass('play').addClass('pause').attr('title', opt.playLabel);

			//Trigger the onPause callback
			opt.onPause.call(this);
		},
		goNext = function(){
			if(defs.lock) return false;

			if(defs.index==defs.total){
				goStep(1);
				if(!opt.replay) stopSteps();

				//Trigger the onLastStep callback
				opt.onLastStep.call(this);
			} else goStep(defs.index+1);

			if(defs.play) {
				clearTimer();
			}
		},
		goPrev = function(){
			if(defs.lock) return false;

			(defs.index==1) ? goStep(defs.total) : goStep(defs.index-1);

			if(defs.play) {
				clearTimer();
			}
		};

		// Run Preloader
		new ImagePreload( defs.images,
			function(i){
				var percent = (i*10);
				preloaderBar.stop().animate({ width:percent+'%' });
			},
			function(){
				preloaderBar.stop().animate({ width:'100%' }, function(){
					preloader.remove();
					steps.show();
					$('a.ipresenter_stepsNav').show();
					if(defs.total > 0 && opt.autoPlay) playSteps();
					if(opt.startStep > 1) goStep(defs.index, true);
					
					//Trigger the onAfterLoad callback
					opt.onAfterLoad.call(this);
				});
			}
		);

		// pause animation on hover
		if(opt.pauseOnHover) {
			parentEl.hover(function(){
				if(defs.play) {
					clearInterval(defs.timer);
					defs.timer = null;
				}
			}, function(){
				if(defs.timer==null && defs.play && defs.degree < 360 && opt.autoPlay && !defs.lock) setTimer();
			});
		}

		// Control Navigation handlers
		$('a#ipresenter_nextStep', parentEl).click(goNext);
		$('a#ipresenter_prevStep', parentEl).click(goPrev);
		$('a.ipresenter-controlPrevNav', parentEl).click(goPrev);
		$('a.ipresenter-controlNextNav', parentEl).click(goNext);

		$('.ipresenter-controlNav a.ipresenter-control', parentEl).click(function(){
			if(defs.lock) return false;
			if($(this).hasClass('active')) return false;
			defs.index = parseInt($(this).attr('rel'));

			goStep(defs.index);

			if(defs.play) {
				clearTimer();
			}
		});

		//Pause/Resume handler
		timer.click(function(){
			if($(this).hasClass('play')) stopSteps();
			else playSteps();
		});

		//Animate Direction nav
		$('.ipresenter_stepsNav', parentEl).css({opacity: opt.directionNavHoverOpacity});
		parentEl.hover(function(){
			$('.ipresenter_stepsNav', parentEl).stop().animate({opacity: 1}, 300);
		}, function(){
			$('.ipresenter_stepsNav', parentEl).stop().animate({opacity: opt.directionNavHoverOpacity}, 300);
		});

		//Animate Control nav
		$('.ipresenter-controlNav', parentEl).css({opacity: opt.controlNavHoverOpacity});
		parentEl.hover(function(){
			$('.ipresenter-controlNav', parentEl).stop().animate({opacity: 1}, 300);
		}, function(){
			$('.ipresenter-controlNav', parentEl).stop().animate({opacity: opt.controlNavHoverOpacity}, 300);
		});

		//Show Tooltip
		$('.ipresenter-controlNav a.ipresenter-control', parentEl).hover(function(){
				var tooltip = $('.ipresenter-tooltip', $(this).parent());
				tooltip.fadeIn();
		}, function(){
				var tooltip = $('.ipresenter-tooltip', $(this).parent());
				tooltip.fadeOut();
		});

		//Touch navigation
		if(opt.touchNav && (navigator.userAgent.match(/ipad|iphone|ipod|android/i))){
			parentEl.swipe({
				swipeLeft:goNext,
				swipeRight:goPrev
			});
		}

		// keyboard navigation handler
		if(opt.keyboardNav) $(document).bind('keyup.iPresenter', function(event){
			switch(event.keyCode){
				case 33: ; // pg up
				case 37: ; // left
				case 38:   // up
					goPrev();
					break;
				case 34: ; // pg down
				case 39: ; // right
				case 40:   // down
					goNext();
					break;
			}
		});

	};

	// Swipe Function
	$.fn.swipe = function(options) {
		options = jQuery.extend({
			threshold: {
				x: 30,
				y: 100
			},
			swipeLeft: function() {
				alert('swiped left');
			},
			swipeRight: function() {
				alert('swiped right');
			}
		}, options);
    
		$(this).each(function() {
			var me = $(this);
			var originalCoord = {
				x: 0,
				y: 0
			};
			var finalCoord = {
				x: 0,
				y: 0
 			};

			function touchMove(event) {
				event.preventDefault();
				finalCoord.x = event.originalEvent.touches[0].pageX;
				finalCoord.y = event.originalEvent.touches[0].pageY;
			}
			function touchEnd(event) {
				var changeY = originalCoord.y - finalCoord.y;
				if (changeY < options.threshold.y && changeY > (options.threshold.y * -1)) {
					changeX = originalCoord.x - finalCoord.x;
					if (changeX > options.threshold.x) {
						options.swipeLeft.call(this);
					}
					if (changeX < (options.threshold.x * -1)) {
						options.swipeRight.call(this);
					}
				}
			}
			function touchStart(event) {
				originalCoord.x = event.originalEvent.targetTouches[0].pageX;
				originalCoord.y = event.originalEvent.targetTouches[0].pageY;
				finalCoord.x = originalCoord.x;
				finalCoord.y = originalCoord.y;
			}
			me.bind("touchstart MozTouchDown", touchStart);
			me.bind("touchmove MozTouchMove", touchMove);
			me.bind("touchend MozTouchRelease", touchEnd);
		});
	};

})(jQuery);

//Image Preloader Function
function ImagePreload(p_aImages,p_pfnPercent,p_pfnFinished){this.m_pfnPercent=p_pfnPercent;this.m_pfnFinished=p_pfnFinished;this.m_nLoaded=0;this.m_nProcessed=0;this.m_aImages=new Array;this.m_nICount=p_aImages.length;for(var i=0;i<p_aImages.length;i++)this.Preload(p_aImages[i])}
ImagePreload.prototype.Preload=function(p_oImage){var oImage=new Image;this.m_aImages.push(oImage);oImage.onload=ImagePreload.prototype.OnLoad;oImage.onerror=ImagePreload.prototype.OnError;oImage.onabort=ImagePreload.prototype.OnAbort;oImage.oImagePreload=this;oImage.bLoaded=false;oImage.source=p_oImage;oImage.src=p_oImage}
ImagePreload.prototype.OnComplete=function(){this.m_nProcessed++;if(this.m_nProcessed==this.m_nICount)this.m_pfnFinished();else this.m_pfnPercent(Math.round((this.m_nProcessed/this.m_nICount)*10))}
ImagePreload.prototype.OnLoad=function(){this.bLoaded=true;this.oImagePreload.m_nLoaded++;this.oImagePreload.OnComplete()}
ImagePreload.prototype.OnError=function(){this.bError=true;this.oImagePreload.OnComplete()}
ImagePreload.prototype.OnAbort=function(){this.bAbort=true;this.oImagePreload.OnComplete()}

function disableSelection(target){if(typeof target.style.MozUserSelect!="undefined")
target.style.MozUserSelect="none"
else if(typeof target.onselectstart!="undefined")
target.onselectstart=function(){return false}
else
target.onmousedown=function(){return false}
target.style.cursor="default"}