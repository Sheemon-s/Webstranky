const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

if (menuToggle && navLinks) {
	menuToggle.addEventListener("click", () => {
		const isOpen = navLinks.classList.toggle("open");
		menuToggle.setAttribute("aria-expanded", String(isOpen));
	});

	navAnchors.forEach((link) => {
		link.addEventListener("click", () => {
			navLinks.classList.remove("open");
			menuToggle.setAttribute("aria-expanded", "false");
		});
	});
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
	const revealObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.18 }
	);

	revealElements.forEach((el) => revealObserver.observe(el));
} else {
	revealElements.forEach((el) => el.classList.add("is-visible"));
}

const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const serviceSelect = document.getElementById("sluzba");
const subjectField = document.getElementById("subject-field");

const serviceMap = {
	tvorba: "WNM - Záujem o Tvorbu webstránok",
	redesign: "WNM - Záujem o Redesign",
	seo: "WNM - Záujem o SEO optimalizáciu",
	sprava: "WNM - Záujem o Správu a údržbu",
};

if (contactForm && formMessage) {
	contactForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		if (!contactForm.checkValidity()) {
			formMessage.textContent = "Prosím, vyplňte všetky povinné polia správne.";
			formMessage.style.color = "#ffd5d5";
			contactForm.reportValidity();
			return;
		}

		if (subjectField && serviceSelect) {
			const selectedService = serviceSelect.value;
			subjectField.value = serviceMap[selectedService] || "Nová správa z WNM webu";
		}

		formMessage.textContent = "Odosielam správu...";
		formMessage.style.color = "#d7e2dd";

		try {
			const response = await fetch(contactForm.action, {
				method: contactForm.method,
				body: new FormData(contactForm),
				headers: {
					Accept: "application/json",
				},
			});
			const result = await response.json();

			if (response.ok && result.success) {
				formMessage.textContent = "Ďakujeme! Správa bola odoslaná, čoskoro vás kontaktujeme.";
				formMessage.style.color = "#4caf50";
				contactForm.reset();
			} else {
				formMessage.textContent = "Nastala chyba. Skúste to znova.";
				formMessage.style.color = "#ff6b6b";
			}
		} catch (error) {
			formMessage.textContent = "Nastala chyba. Skúste to znova.";
			formMessage.style.color = "#ff6b6b";
		}
	});
}
