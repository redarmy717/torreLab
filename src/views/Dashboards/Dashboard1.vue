<template>
  <b-container fluid>
    <iq-card className="paddedCard" class="text-center">
      <template v-solt:headerTitle>
         <h2>Welcome Back</h2>
          <p>This could be a Hello World but it is not. Let's connect your Torre Account</p>
      </template>
      <b-row>
        <b-col>
          <b-form-input v-model="username" placeholder="Enter your Torre username" class="text-center"></b-form-input>
            <router-link :to="{name:'social.list', params:{username: username}}">
                <b-button variant="success" class="btn btn-success mt-2" size="lg">Connect</b-button>
            </router-link>
        </b-col>
      </b-row>
    </iq-card>
  </b-container>
</template>
<script>
import { core } from '../../config/pluginInit'
export default {
  name: 'Dashboard1',
  mounted () {
    core.index()
  },
  data () {
    return {
      username: ''
    }
  },
  methods: {

  }
}
</script>

<style>
.iq-card-body{
  flex: unset;
}
</style>
