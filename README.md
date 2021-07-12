# simplebar
Simple standalone web component to render a simple bar graph.

## Install
```
npm install -S @intermezzon/simplebar
```

## Usage
This is a web component, so first of all, include the script
```
<script src="lib/iz-simplebar.js"></script>
```

Then since this is a web component, we just use the tag `iz-simplebar`

```
<div>
	<iz-simplebar value="40" min="0" max="100"></iz-simplebar>
</div>

```

this will produce
![alt text](https://github.com/Intermezzon/simplebar/blob/main/images/test1.png?raw=true)

## Attributes

 - **value:** The value to visualize donut to
 - **max:** Max value. Default 100
 - **min:** Min value. Default 0
 - **height:** Height in pixels. Default 10
 - **width:** Width of whole graph with unit. Default "100%"
 - **color:** Color of the bar. Default rgba(33,80,150,0.7)
