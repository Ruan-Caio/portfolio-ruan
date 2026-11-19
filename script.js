document.addEventListener("DOMContentLoaded", () => {
    const projectCards = Array.from(
        document.querySelectorAll(".project-grid .project-card")
    );
    const filterGroup = document.getElementById("project-filters");
    const filterStatus = document.getElementById("project-filter-status");
    const filterButtons = Array.from(
        document.querySelectorAll(".project-filter")
    );

    if (filterGroup && filterStatus && projectCards.length > 0) {
        filterGroup.hidden = false;
        filterStatus.hidden = false;

        const updateFilterStatus = () => {
            const visibleCount = projectCards.filter((card) => !card.hidden).length;
            const noun = visibleCount === 1 ? "projeto encontrado" : "projetos encontrados";
            filterStatus.textContent = visibleCount + " " + noun + ".";
        };

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const selectedFilter = button.dataset.filter;

                filterButtons.forEach((filterButton) => {
                    const isSelected = filterButton === button;
                    filterButton.classList.toggle("is-active", isSelected);
                    filterButton.setAttribute("aria-pressed", String(isSelected));
                });

                projectCards.forEach((card) => {
                    const shouldShow =
                        selectedFilter === "todos" ||
                        card.dataset.category === selectedFilter;
                    card.hidden = !shouldShow;
                });

                updateFilterStatus();
            });
        });

        updateFilterStatus();
    }

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
            { threshold: 0.12 }
        );

        projectCards.forEach((card) => {
            card.classList.add("reveal-on-scroll");
            revealObserver.observe(card);
        });

        const sections = document.querySelectorAll("main section[id]");
        const navigationLinks = document.querySelectorAll('nav a[href^="#"]');

        const navigationObserver = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

                if (visibleSections.length === 0) return;

                const currentId = visibleSections[0].target.id;

                navigationLinks.forEach((link) => {
                    const isCurrent = link.getAttribute("href") === "#" + currentId;
                    link.classList.toggle("is-active", isCurrent);

                    if (isCurrent) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            },
            {
                rootMargin: "-20% 0px -65% 0px",
                threshold: [0, 0.2, 0.5, 0.8]
            }
        );

        sections.forEach((section) => navigationObserver.observe(section));
    }

    const backToTopButton = document.getElementById("back-to-top");

    if (backToTopButton) {
        const updateBackToTopVisibility = () => {
            backToTopButton.hidden = window.scrollY < 420;
        };

        updateBackToTopVisibility();
        window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });

        backToTopButton.addEventListener("click", () => {
            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });
        });
    }
});
