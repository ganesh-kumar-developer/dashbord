const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
		datasets: [{
			label: '# of Votes',
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)'
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)'
			],
			borderWidth: 1
		}]
	},
	options: {
		scales: {
			y: {
				beginAtZero: true
			}
		},
		responsive: true,
	}
});
// var canvas = document.getElementById("canvas");

// var ctx = canvas.getContext("2d");

var canvasOffset = $("#myChart").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

var startX;
var startY;
var isDown = false;


var pi2 = Math.PI * 2;
var resizerRadius = 8;
var rr = resizerRadius * resizerRadius;
var draggingResizer = {
	x: 0,
	y: 0
};
var imageX = 50;
var imageY = 50;
var imageWidth, imageHeight, imageRight, imageBottom;
var draggingImage = false;
var startX;
var startY;



// var img = new Image();
// img.onload = function () {
//     imageWidth = img.width;
//     imageHeight = img.height;
//     imageRight = imageX + imageWidth;
//     imageBottom = imageY + imageHeight
//     draw(true, false);
// }
// img.src = "https://i.imgur.com/NHmhBKR.jpg";

function draw(withAnchors, withBorders) {

	// clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw the image
	ctx.drawImage(img, 0, 0, img.width, img.height, imageX, imageY, imageWidth, imageHeight);

	// optionally draw the draggable anchors
	if (withAnchors) {
		drawDragAnchor(imageX, imageY);
		drawDragAnchor(imageRight, imageY);
		drawDragAnchor(imageRight, imageBottom);
		drawDragAnchor(imageX, imageBottom);
	}

	// optionally draw the connecting anchor lines
	if (withBorders) {
		ctx.beginPath();
		ctx.moveTo(imageX, imageY);
		ctx.lineTo(imageRight, imageY);
		ctx.lineTo(imageRight, imageBottom);
		ctx.lineTo(imageX, imageBottom);
		ctx.closePath();
		ctx.stroke();
	}

}

function drawDragAnchor(x, y) {
	ctx.beginPath();
	ctx.arc(x, y, resizerRadius, 0, pi2, false);
	ctx.closePath();
	ctx.fill();
}

function anchorHitTest(x, y) {

	var dx, dy;

	// top-left
	dx = x - imageX;
	dy = y - imageY;
	if (dx * dx + dy * dy <= rr) {
		return (0);
	}
	// top-right
	dx = x - imageRight;
	dy = y - imageY;
	if (dx * dx + dy * dy <= rr) {
		return (1);
	}
	// bottom-right
	dx = x - imageRight;
	dy = y - imageBottom;
	if (dx * dx + dy * dy <= rr) {
		return (2);
	}
	// bottom-left
	dx = x - imageX;
	dy = y - imageBottom;
	if (dx * dx + dy * dy <= rr) {
		return (3);
	}
	return (-1);

}

function hitImage(x, y) {
	return (x > imageX && x < imageX + imageWidth && y > imageY && y < imageY + imageHeight);
}

function handleMouseDown(e) {
	startX = parseInt(e.clientX - offsetX);
	startY = parseInt(e.clientY - offsetY);
	draggingResizer = anchorHitTest(startX, startY);
	draggingImage = draggingResizer < 0 && hitImage(startX, startY);
}

function handleMouseUp(e) {
	draggingResizer = -1;
	draggingImage = false;
	draw(true, false);
}

function handleMouseOut(e) {
	handleMouseUp(e);
}

function handleMouseMove(e) {

	if (draggingResizer > -1) {

		mouseX = parseInt(e.clientX - offsetX);
		mouseY = parseInt(e.clientY - offsetY);

		// resize the image
		switch (draggingResizer) {
			case 0:
				//top-left
				imageX = mouseX;
				imageWidth = imageRight - mouseX;
				imageY = mouseY;
				imageHeight = imageBottom - mouseY;
				break;
			case 1:
				//top-right
				imageY = mouseY;
				imageWidth = mouseX - imageX;
				imageHeight = imageBottom - mouseY;
				break;
			case 2:
				//bottom-right
				imageWidth = mouseX - imageX;
				imageHeight = mouseY - imageY;
				break;
			case 3:
				//bottom-left
				imageX = mouseX;
				imageWidth = imageRight - mouseX;
				imageHeight = mouseY - imageY;
				break;
		}

		if (imageWidth < 25) {
			imageWidth = 25;
		}
		if (imageHeight < 25) {
			imageHeight = 25;
		}

		// set the image right and bottom
		imageRight = imageX + imageWidth;
		imageBottom = imageY + imageHeight;

		// redraw the image with resizing anchors
		draw(true, true);

	} else if (draggingImage) {

		imageClick = false;

		mouseX = parseInt(e.clientX - offsetX);
		mouseY = parseInt(e.clientY - offsetY);

		// move the image by the amount of the latest drag
		var dx = mouseX - startX;
		var dy = mouseY - startY;
		imageX += dx;
		imageY += dy;
		imageRight += dx;
		imageBottom += dy;
		// reset the startXY for next time
		startX = mouseX;
		startY = mouseY;

		// redraw the image with border
		draw(false, true);

	}


}

$("#myChart").mousedown(function (e) {
	handleMouseDown(e);
});
$("#myChart").mousemove(function (e) {
	handleMouseMove(e);
});
$("#myChart").mouseup(function (e) {
	handleMouseUp(e);
});
$("#myChart").mouseout(function (e) {
	handleMouseOut(e);
});