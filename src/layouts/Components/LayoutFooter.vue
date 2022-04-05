<template>
<div>
  <footer class="iq-footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6">
          <ul class="list-inline mb-0">
            <li class="list-inline-item"><a>Job Application for TorreLabs.</a></li>
          </ul>
        </div>
        <div class="col-lg-6 text-right">
          Copyright 2021. Website made by <a href="#">Sebastián Osorno Tobón</a>.
        </div>
      </div>
    </div>
  </footer>
</div>
</template>
<script>
import { APPNAME } from '../../config/pluginInit'
export default {
  name: 'LayoutFooter',
  data () {
    return {
      appName: APPNAME
    }
  }
}
</script>
