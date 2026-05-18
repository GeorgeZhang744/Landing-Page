(function () {
	"use strict";

	var nav = document.getElementById("nav");
	var toggle = document.querySelector(".nav-toggle");
	var navLinks = document.querySelector(".nav-links");
	var sections = document.querySelectorAll("section[id]");
	var linkMap = {};

	if (!nav) return;

	document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (link) {
		var id = link.getAttribute("href").slice(1);
		if (id) linkMap[id] = link;
	});

	function setActiveSection(id) {
		Object.keys(linkMap).forEach(function (sectionId) {
			linkMap[sectionId].classList.toggle("active", sectionId === id);
		});
	}

	function closeMobileNav() {
		if (!toggle || !navLinks) return;
		toggle.setAttribute("aria-expanded", "false");
		navLinks.classList.remove("is-open");
		document.body.style.overflow = "";
	}

	if (toggle && navLinks) {
		toggle.addEventListener("click", function () {
			var open = toggle.getAttribute("aria-expanded") === "true";
			toggle.setAttribute("aria-expanded", open ? "false" : "true");
			navLinks.classList.toggle("is-open", !open);
			document.body.style.overflow = open ? "" : "hidden";
		});
	}

	document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
		anchor.addEventListener("click", function (e) {
			var targetId = this.getAttribute("href");
			if (!targetId || targetId === "#") return;

			var target = document.querySelector(targetId);
			if (!target) return;

			e.preventDefault();
			closeMobileNav();

			var offset = nav.offsetHeight;
			var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

			window.scrollTo({ top: top, behavior: "smooth" });
			history.pushState(null, "", targetId);
			setActiveSection(targetId.slice(1));
		});
	});

	if ("IntersectionObserver" in window && sections.length) {
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{ rootMargin: "-" + nav.offsetHeight + "px 0px -55% 0px", threshold: 0 }
		);

		sections.forEach(function (section) {
			observer.observe(section);
		});
	}

	window.addEventListener("resize", closeMobileNav);
})();
