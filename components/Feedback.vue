<template>
  <div class="contact-container">
    <div class="content-wrapper">
      <div class="text-section">
        <h1>On est à votre écoute</h1>
        <p class="description">
          La satisfaction de nos clients est notre but majeur. Si vous souhaitez commencer un projet mais vous avez besoin d'aide, alors détendez-vous, nous serons à votre côté pour vous présenter tout accompagnement, conseils et solutions pour réussir votre projet. Nous avons pu gagner, au fil du temps, l'expérience et la confiance d'un grand nombre d'entreprises qui sont tout à fait satisfaites par notre collaboration.
        </p>
      </div>

      <div class="form-section">
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Votre nom</label>
              <input type="text" id="name" v-model="formData.name" required>
            </div>

            <div class="form-group">
              <label for="email">Votre Email</label>
              <input type="email" id="email" v-model="formData.email" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phone">Téléphone</label>
              <input type="tel" id="phone" v-model="formData.phone">
            </div>

            <div class="form-group">
              <label for="subject">Objet</label>
              <input type="text" id="subject" v-model="formData.subject">
            </div>
          </div>

          <div class="form-group full-width">
            <label for="message">Votre Message</label>
            <textarea id="message" v-model="formData.message" required></textarea>
          </div>

          <!-- Accept Privacy Checkbox -->
          <div class="form-group full-width checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="acceptPrivacy" required>
              <span>
                En soumettant ce formulaire, j’accepte que mes informations soient utilisées par ce site.
              </span>
            </label>
          </div>

          <!-- reCAPTCHA v2 Checkbox -->
          <div class="form-group full-width">
            <div ref="recaptcha" class="g-recaptcha"></div>
            <div v-if="recaptchaError" class="error-message">{{ recaptchaError }}</div>
          </div>

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            ENVOYER VOTRE MESSAGE
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
  data() {
    return {
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
  mounted() {
    this.renderRecaptcha();
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
      this.recaptchaError = 'La vérification CAPTCHA a expiré. Veuillez la renouveler.';
    },

    onError() {
      this.recaptchaToken = '';
      this.recaptchaError = 'Erreur lors de la vérification CAPTCHA.';
    },

    async handleSubmit() {
      if (!this.acceptPrivacy) {
        alert("Vous devez accepter le traitement de vos informations.");
        return;
      }

      if (!this.recaptchaToken) {
        this.recaptchaError = 'Veuillez compléter la vérification CAPTCHA.';
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
          alert('Merci pour votre message! Nous vous contacterons bientôt.');
        } else {
          this.recaptchaError = data.message || 'Une erreur est survenue.';
        }
      } catch (error) {
        console.error('Erreur:', error);
        this.recaptchaError = 'Erreur réseau. Veuillez réessayer plus tard.';
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };
      this.recaptchaToken = '';
      this.recaptchaError = '';
      this.acceptPrivacy = false;
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
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
