<template>
    <Header />
  <div class="min-h-screen bg-purple-50 flex flex-col items-center justify-center px-4">
    

    <!-- Contact Info -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-semibold text-purple-800 mb-4">Contactez-nous</h2>

      <div class="space-y-2 text-lg text-purple-700">
        <a :href="`tel:${content?.numero_telephone?.replace(/\s+/g, '')}`" class="flex items-center justify-center space-x-2 hover:text-purple-900 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 5a2 2 0 012-2h1.28a2 2 0 011.933 1.515l.518 2.073a2 2 0 01-.45 1.898l-1.27 1.27a16.042 16.042 0 006.586 6.586l1.27-1.27a2 2 0 011.898-.45l2.073.518A2 2 0 0119 19.72V21a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
          </svg>
          <span>{{ content?.numero_telephone }}</span>
        </a>

        <a :href="`mailto:${content?.email}`" class="flex items-center justify-center space-x-2 hover:text-purple-900 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 12H8m0 0l4-4m-4 4l4 4m8-12a2 2 0 00-2-2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4z" />
          </svg>
          <span>{{ content?.email }}</span>
        </a>
      </div>
    </div>

    <!-- Contact Form -->
    <form class="bg-white shadow-md rounded-xl p-6 w-full max-w-md space-y-4">
      <div>
        <label class="block text-purple-700 mb-1" for="name">Nom</label>
        <input
        required
          id="name"
          type="text"
          placeholder="Entrez votre nom"
          class="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label class="block text-purple-700 mb-1" for="email">Email</label>
        <input
        required
          id="email"
          type="email"
          placeholder="Entrez votre email"
          class="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label class="block text-purple-700 mb-1" for="message">Message</label>
        <textarea
          required
          id="message"
          rows="5"
          placeholder="Écrivez votre message"
          class="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md transition"
      >
        Envoyer
      </button>
    </form>
  </div>
  <Footer />
</template>


<script>
export default {
  name: 'ContactPage',
  data() {
    return {
      content: null,
      loading: true,
      error: null,
      formData: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      recaptchaSiteKey: '6Lfho4IrAAAAAEv4Q_diU3hKviyP-OdjdGPIaXXt',
      recaptchaToken: '',
      recaptchaError: '',
      isSubmitting: false,
      acceptPrivacy: false
    };
  },
  async mounted() {
    try {
      const page = await this.$pageCache.getPage(81);
      if (page?.acf) this.content = page.acf;
    } catch (e) {
      console.error(e);
      this.error = 'Erreur lors du chargement du contenu.';
    } finally {
      this.loading = false;
      this.renderRecaptcha();
    }
  },
  methods: {
    renderRecaptcha() {
      if (window.grecaptcha) {
        window.grecaptcha.render(this.$refs.recaptcha, {
          sitekey: this.recaptchaSiteKey,
          callback: this.onVerify,
          'expired-callback': this.onExpired,
          'error-callback': this.onError
        });
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = this.renderRecaptcha;
        document.head.appendChild(script);
      }
    },
    onVerify(token) {
      this.recaptchaToken = token;
      this.recaptchaError = '';
    },
    onExpired() {
      this.recaptchaToken = '';
      this.recaptchaError = 'La vérification CAPTCHA a expiré.';
    },
    onError() {
      this.recaptchaToken = '';
      this.recaptchaError = 'Erreur CAPTCHA.';
    },
    async handleSubmit() {
      if (!this.acceptPrivacy) {
        alert('Veuillez accepter la politique de confidentialité.');
        return;
      }

      if (!this.recaptchaToken) {
        this.recaptchaError = 'Veuillez compléter le CAPTCHA.';
        return;
      }

      this.isSubmitting = true;

      try {
        const response = await fetch('https://web.weblinking.fr/wp-json/custom-contact/v1/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...this.formData,
            token: this.recaptchaToken
          })
        });

        const data = await response.json();
        if (data.success) {
          this.resetForm();
          alert('Merci pour votre partage floral !');
        } else {
          this.recaptchaError = data.message || 'Une erreur est survenue.';
        }
      } catch (error) {
        console.error(error);
        this.recaptchaError = 'Erreur réseau. Réessayez plus tard.';
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = { name: '', email: '', phone: '', subject: '', message: '' };
      this.recaptchaToken = '';
      this.recaptchaError = '';
      this.acceptPrivacy = false;
      if (window.grecaptcha) window.grecaptcha.reset();
    }
  }
};
</script>

<style scoped>
.contact-container {
  background-color: #00b489;
  padding: 60px 20px;
  color: white;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.text-section {
  flex: 1;
  min-width: 300px;
}

.form-section {
  flex: 1;
  min-width: 300px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 25px;
  line-height: 1.2;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 0;
}

.contact-form {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  min-width: 0;
}

.full-width {
  width: 100%;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #2c3e50;
}

input[type="text"],
input[type="email"],
input[type="tel"],
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1rem;
}

textarea {
  height: 150px;
  resize: vertical;
}

.submit-btn {
  background-color: #00b489;
  color: white;
  border: none;
  padding: 14px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 6px;
  text-transform: uppercase;
  font-weight: bold;
  width: 100%;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #128C7E;
}

.error-message {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 8px;
}

.g-recaptcha {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.checkbox-group {
  margin-top: 10px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  font-size: 0.95rem;
  color: #2c3e50;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 10px;
  margin-top: 4px;
  transform: scale(1.2);
  cursor: pointer;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .content-wrapper {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
