class PortfolioPopupManager {
    constructor() {
        this.$container = document.querySelector(".js-portfolio-popup");
        if (!this.$container) return;

        this.$messages = [...this.$container.querySelectorAll(".js-message")];
        this.$yes = this.$container.querySelector(".js-yes");
        this.$no = this.$container.querySelector(".js-no");
        this.$minimizes = [...this.$container.querySelectorAll(".js-minimize")];
        this.$fab = document.querySelector(".js-portfolio-popup-fab");

        this.step = 0;
        this.maxStep = this.$messages.length - 1;
        
        const storedSeen = window.localStorage.getItem("portfolioPopupSeenCount");
        this.seenCount = storedSeen ? parseInt(storedSeen, 10) : 0;
        
        this.shown = false;
        this.prevent = !!window.localStorage.getItem("portfolioPopupPrevent");

        if (!this.prevent) {
            this.setYesNo();
            this.setLog();
            this.setupTrigger();
        }
    }

    setYesNo() {
        this.$yes.addEventListener("click", (e) => {
            e.preventDefault();
            window.localStorage.setItem("portfolioPopupPrevent", "1");
            setTimeout(() => {
                this.hide();
            }, 1000);

            const contactSection = document.getElementById("contact");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
            }
        });

        this.$no.addEventListener("click", (e) => {
            e.preventDefault();
            this.next();
            setTimeout(() => {
                this.hide();
            }, 5000);
        });

        this.$yes.addEventListener("mouseenter", () => {
            this.$container.classList.remove("is-hover-none", "is-hover-no");
            this.$container.classList.add("is-hover-yes");
        });
        
        this.$no.addEventListener("mouseenter", () => {
            this.$container.classList.remove("is-hover-none", "is-hover-yes");
            this.$container.classList.add("is-hover-no");
        });

        const resetHover = () => {
            this.$container.classList.remove("is-hover-yes", "is-hover-no");
            this.$container.classList.add("is-hover-none");
        };
        this.$yes.addEventListener("mouseleave", resetHover);
        this.$no.addEventListener("mouseleave", resetHover);

        this.$minimizes.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.minimize();
            });
        });

        if (this.$fab) {
            this.$fab.addEventListener("click", () => {
                this.restore();
            });
        }
    }

    setLog() {
        console.log("%cWhat are you doing here?! you sneaky developer...", "color: #32ffce");
        console.log("%cDo you want to learn how this portfolio has been made?", "color: #32ffce");
        console.log("%cCheckout the portfolio details inside index.html!", "color: #32ffce");
        console.log("%c— Hari Prasath", "color: #777777");
    }

    setupTrigger() {
        // Trigger after 12 seconds
        this.triggerTimeout = setTimeout(() => {
            this.start();
        }, 12000);

        // Or trigger earlier if they scroll past 30% of the page
        const onScroll = () => {
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (documentHeight > 0) {
                const scrollPercent = window.scrollY / documentHeight;
                if (scrollPercent > 0.3) {
                    this.start();
                    window.removeEventListener("scroll", onScroll);
                    if (this.triggerTimeout) {
                        clearTimeout(this.triggerTimeout);
                    }
                }
            }
        };
        window.addEventListener("scroll", onScroll);
    }

    start() {
        if (this.shown) return;
        this.shown = true;
        this.$container.classList.add("is-active");

        // Increment seen count
        window.localStorage.setItem("portfolioPopupSeenCount", (this.seenCount + 1).toString());

        // Step through dialog elements with delays
        this.next(); // Bubble 1: "Hey! You enjoy my site..."
        
        setTimeout(() => this.next(), 4000); // Bubble 2: "Learn how..."
        setTimeout(() => this.next(), 7000); // Bubble 3: Yes/No buttons
    }

    next() {
        if (this.step > this.maxStep) return;
        this.step++;
        this.updateMessages();
    }

    updateMessages() {
        let count = 0;
        
        // Show messages that have been unlocked
        for (const message of this.$messages) {
            if (count < this.step) {
                message.classList.add("is-visible");
            }
            count++;
        }

        // Stacking calculations: shift older bubbles upward by their height
        this.$messages.reverse();
        let totalOffsetHeight = 0;
        let index = this.maxStep;
        
        for (const message of this.$messages) {
            const h = message.offsetHeight;
            if (index < this.step) {
                message.style.transform = `translateY(${-totalOffsetHeight}px)`;
                totalOffsetHeight += h + 20; // 20px spacing
            } else {
                message.style.transform = `translateY(${h}px)`;
            }
            index--;
        }
        this.$messages.reverse();
    }

    hide() {
        for (const message of this.$messages) {
            message.classList.remove("is-visible");
        }
        setTimeout(() => {
            this.$container.classList.remove("is-active");
        }, 500);
    }

    minimize() {
        this.$container.classList.remove("is-active");
        if (this.$fab) {
            this.$fab.classList.add("is-visible");
        }
    }

    restore() {
        if (this.$fab) {
            this.$fab.classList.remove("is-visible");
        }
        this.$container.classList.add("is-active");
        this.updateMessages();
    }
}

// Initialize on DOM ready
window.addEventListener("DOMContentLoaded", () => {
    new PortfolioPopupManager();
});
