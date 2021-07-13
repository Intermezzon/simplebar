
var izSimpleBarInit = false;

class IzSimpleBar extends HTMLElement
{
	constructor()
	{
		super();

		//initializations
		this.created = false;

		this.animateStart = 0;
		this.animateEnd = 0;
		this.animateCurrent = 0;
		this.animateStep = 0;
	}

	init() {
		if (!izSimpleBarInit && document.body) {
			izSimpleBarInit = true;

			/////////////////////////////////////////////////////
			// Generic style outside web component
			const bodyStyle = document.createElement('style');
			bodyStyle.type = 'text/css';
			bodyStyle.appendChild(document.createTextNode(`
.iz-simplebar {
	display: flex;
	align-items: center;
}
.iz-simplebar-label {
	color: rgba(0,0,0,0.5);
	margin: 10px;
	font-size: 85%;
}
.iz-simplebar-bar {
	flex: 1;
	position: relative;
}
.iz-simplebar-filled {
	opacity: 0.7;
	height: 10px;
	position: relative;
}
.iz-simplebar-barline {
	height: 10px;
	background: rgba(0,0,0,0.1);
	overflow: hidden;
	border-radius: 3px;
}
.iz-simplebar-value, .iz-simplebar-zero {
	position: relative;
	left: 0;
}
.iz-simplebar-value{
	width: 50px;
	text-align: center;
	margin-left: -25px;
	margin-bottom: 4px;
}
.iz-simplebar-zero {
	text-align: center;
	width: 20px;
	margin-left: -10px;
	font-size: 85%;
	color: rgba(0,0,0,0.5);
}
.iz-simplebar-zero-line {
	border-right: 2px solid rgba(0,0,0,0.4);
	width: 9px;
}
			`));
			document.body.appendChild(bodyStyle);
		}
	}

	createGraph()
	{
		this.init();

		const value = Number(this.getAttribute('value') || 0);
		this.max = Number(this.getAttribute('max') || 100);
		this.min = Number(this.getAttribute('min') || 0);
		const height = Number(this.getAttribute('height') || 10);
		const width = this.getAttribute('width') || '100%';
		const color = this.getAttribute('color') || '#223f63';

		const zeroPos = -this.min / (this.max - this.min);
		const valuePos = (value - this.min) / (this.max - this.min);

		this.innerHTML = `<div class="iz-simplebar" style="width:` + width + `;">
				<div class="iz-simplebar-label">` + this.formatNum(this.min) + `</div>
				<div class="iz-simplebar-bar">
					<div class="iz-simplebar-value" style="left:` + (valuePos * 100) + `%;color:` + color + `"></div>
					<div class="iz-simplebar-barline" style="height:` + height + `px;">
						<div class="iz-simplebar-filled" style="height:` + height + `px;width:0;background:` + color + `"></div>
					</div>
					<div class="iz-simplebar-zero" style="left:` + (zeroPos * 100) + `%;margin-top:` + (-height) + `px">
						<div class="iz-simplebar-zero-line" style="height:` + (height + 4) + `px;"></div>
						0
					</div>
				</div>
				<div class="iz-simplebar-label">` + this.formatNum(this.max) + `</div>
			</div>`;

		this.bar = this.querySelector('.iz-simplebar-filled');
	}

	render(val)
	{
		let width = val;
		let left = - this.min;
		if (val < 0) {
			width = -width;
			left = val - this.min;
		}
		//(this.max - this.min)
		this.bar.style.width = (100 * width / (this.max - this.min)) + '%';
		this.bar.style.left = (100 * left / (this.max - this.min)) + '%';
		this.querySelector('.iz-simplebar-value').style.left = (100 * (val - this.min) / (this.max - this.min)) + '%';

	}

	animate()
	{
		this.animateStep--;
		if (this.animateStep) {
			window.requestAnimationFrame(e => {
				this.animate();
			});
			// deaccel
			this.animateCurrent = this.animateCurrent + (this.animateEnd - this.animateCurrent) * 0.2;

			this.render(this.animateCurrent);
		} else {
			this.render(this.animateEnd);		
		}
	}

	formatNum(num)
	{
		return (num < 0 ? '' : '+') + num;
	}

	setValue(val)
	{
		const startAnim = !this.animateStep;
		this.animateEnd = val;
		this.animateStep = 20;
		this.animateStart = this.animateCurrent;

		this.querySelector('.iz-simplebar-value').textContent = this.formatNum(val);

		if (startAnim) {
			this.animate();
		}
	}

	connectedCallback()
	{
		if (!this.created) {
			this.created = true;

			this.createGraph();
			this.setValue(Number(this.getAttribute('value') || 0));
		}
	}

	static get observedAttributes() {
		return ['value'];
	}

	attributeChangedCallback(name, oldVal, val)
	{
		if (this.created && name == 'value') {
			this.setValue(Number(val));
		}
	}
}

// Register tag
window.customElements.define('iz-simplebar', IzSimpleBar);

