$(document).ready(function() {
	// setTimeout(function() {
	// 	showPromo();
	// }, 5000);

	$(".promo .hider").click(function() {
		hidePromo();
	});

	$("#promoTrigger").click(function() {
		showPromo();
		
	});

	function showPromo() {
		$("#promoBox").show();
		$(".promo").addClass("show");
		$("#promoTrigger").hide();
	}

	function hidePromo() {
		$(".promo").removeClass("show");
		setTimeout(function() {
			$("#promoTrigger").show();
			$("#promoBox").hide();
		}, 800);
	}
});
