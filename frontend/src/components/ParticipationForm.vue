<template>
  <div class="container">
    <h2>Enregistrer une participation</h2>
    <form @submit.prevent="submitParticipation">
      <div>
        <label for="personne">Personne :</label>
        <select id="personne" v-model="participation.matricule">
          <option disabled value="">Sélectionnez une personne</option>
          <option v-for="person in personnes" :key="person.matricule" :value="person.matricule">
            {{ person.nom }} {{ person.prenom }}
          </option>
        </select>
      </div>
      <div>
        <label for="projet">Projet :</label>
        <select id="projet" v-model="participation.codeProjet">
          <option disabled value="">Sélectionnez un projet</option>
          <option v-for="project in projets" :key="project.id" :value="project.id">
            {{ project.nom }}
          </option>
        </select>
      </div>
      <div>
        <label for="role">Rôle :</label>
        <input type="text" id="role" v-model="participation.role" placeholder="Rôle dans le projet" required />
      </div>
      <div>
        <label for="pourcentage">Pourcentage de participation (%) :</label>
        <input
          type="number"
          id="pourcentage"
          v-model.number="participation.pourcentage"
          min="0"
          max="100"
          required
        />
      </div>

      <!-- Barre de progression -->
      <div>
        <label for="pourcentageBar">Progression : {{ participation.pourcentage }}%</label>
        <progress id="pourcentageBar" :value="participation.pourcentage" max="100"></progress>
      </div>

      <button type="submit">Enregistrer</button>
    </form>
    <div v-if="message" :class="{'success': success, 'error': !success}">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import doAjaxRequest from '@/util/util.js'

const personnes = ref([])
const projets = ref([])

const participation = reactive({
  matricule: '',
  codeProjet: '',
  role: '',
  pourcentage: 0,
})

const message = ref('')
const success = ref(false)

const fetchPersonnes = async () => {
  try {
    const result = await doAjaxRequest('/api/personnes')
    personnes.value = result._embedded ? result._embedded.personnes : []
  } catch (error) {
    console.error("Erreur lors du chargement des personnes :", error)
  }
}

const fetchProjets = async () => {
  try {
    const result = await doAjaxRequest('/api/projets')
    projets.value = result._embedded ? result._embedded.projets : []
  } catch (error) {
    console.error("Erreur lors du chargement des projets :", error)
  }
}

onMounted(() => {
  fetchPersonnes()
  fetchProjets()
})

const submitParticipation = async () => {
  try {
    const decimalPourcentage = participation.pourcentage / 100
    const params = new URLSearchParams()
    params.append('matricule', participation.matricule)
    params.append('codeProjet', participation.codeProjet)
    params.append('role', participation.role)
    params.append('pourcentage', decimalPourcentage)

    const options = {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }

    await doAjaxRequest('/api/gestion/participation', options)
    message.value = "Participation enregistrée avec succès !"
    success.value = true

    participation.matricule = ''
    participation.codeProjet = ''
    participation.role = ''
    participation.pourcentage = 0
  } catch (error) {
    message.value = "Erreur : " + (error.message || "Impossible d'enregistrer la participation.")
    success.value = false
    console.error("Erreur lors de l'enregistrement de la participation :", error)
  }
}
</script>

<style scoped>
.container {
  margin: 2rem auto;
  max-width: 600px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}
form > div {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input, select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
progress {
  width: 100%;
  height: 20px;
  margin-top: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
}
.success {
  color: green;
  margin-top: 1rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
