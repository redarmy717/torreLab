<template>
  <b-overlay :show="overlay" rounded="sm">
    <b-container fluid v-if="userFound">
      <b-modal v-model="skillModal.status" @close="clearModal" :title="`${skillModal.skill.name} - ${skillModal.skill.proficiency}`">
        <b-row class="mb-2 text-center">
          <b-col>
            <h5 class="card-title">About this skill</h5>
          </b-col>
        </b-row>
        <b-row class="mb-4">
          <b-col cols="6">
            <div class="d-flex d-flex align-items-center justify-content-between">
              <div class="text-center">
                  <h5>{{skillModal.skill.recommendations}}</h5>
                  <p class="fontsize-sm m-0">Recommendations</p>
              </div>
            </div>
          </b-col>
          <b-col cols="6">
            <div class="d-flex d-flex align-items-center justify-content-between">
              <div class="text-center">
                  <h5>{{skillModal.skill.weight}}</h5>
                  <p class="fontsize-sm m-0">Recommendations weight</p>
              </div>
            </div>
          </b-col>
        </b-row>
        <iq-card>
          <template v-slot:headerTitle>
            <h5 class="card-title">Relevant People</h5>
          </template>
          <template v-slot:body>
            <ul class="suggestions-lists m-0 p-0">
              <li v-for="(item,index) in relatedPeople" :key="index" class="d-flex mb-4 align-items-center">
                <div class="user-img img-fluid">
                  <b-img :src="item.image" alt="story-img" rounded="circle" class="avatar-40" />
                </div>
                <div class="media-support-info ml-3">
                  <h6>{{ item.name }}</h6>
                  <p class="mb-0">{{ item.role }}</p>
                </div>
                <div class="iq-card-header-toolbar d-flex align-items-center">
                  <b-dropdown id="dropdownMenuButton40" right variant="none" menu-class="p-0">
                    <template v-slot:button-content>
                      <i class="ri-more-2-line"></i>
                    </template>
                    <b-dropdown-item :href="`https://torre.co/${item.username}`"><i class="ri-user-unfollow-line mr-2"></i>Visit Profile</b-dropdown-item>
                  </b-dropdown>
                </div>
              </li>
            </ul>
          </template>
        </iq-card>
        <template #modal-footer>
          <b-button variant="success" size="sm" class="float-right ml-2" @click="clearModal">
            Ok
          </b-button>
        </template>
      </b-modal>
      <b-row>
        <b-col sm="12">
          <iq-card body-class=" profile-page p-0">
            <template v-slot:body>
              <div class="profile-header">
                <div class="cover-container">
                  <b-img v-bind:src="user.background" alt="profile-bg" rounded fluid class="w-100" />
                </div>
                <div class="profile-info p-4">
                  <b-row>
                    <b-col md="6" sm="12">
                      <div class="user-detail pl-5">
                        <div class="d-flex flex-wrap align-items-center">
                          <div class="profile-img pr-4">
                            <b-img v-bind:src="user.profile" alt="profile-img" fluid class="avatar-130" />
                          </div>
                          <div class="profile-detail d-flex align-items-center">
                            <h3>{{user.name}}</h3>
                            <p class="m-0 pl-3"> {{user.role}} </p>
                          </div>
                        </div>
                      </div>
                    </b-col>
                    <b-col md="6" sm="12">
                      <tab-nav :pills="true" id="pills-tab" class="profile-feed-items d-flex justify-content-end">
                        <tab-nav-items :active="true" id="pills-skills-tab" href="#profile-skills" ariaControls="pills-home" role="tab" :ariaSelected="true" title="Skills" />
                        <tab-nav-items :active="false" id="pills-about-tab" href="#profile-about" ariaControls="pills-about" role="tab" :ariaSelected="false" title="About" />
                        <tab-nav-items :active="false" id="pills-related-tab" href="#profile-related" ariaControls="pills-related" role="tab" :ariaSelected="false" title="Relevant People" method="findPeopleBySkill" @findPeopleBySkill="findPeopleBySkill('Innovation')" />
                        <tab-nav-items :active="false" id="pills-education-tab" href="#profile-education" ariaControls="pills-education" role="tab" :ariaSelected="false" title="Education" method="getEducationArray" @getEducationArray="getEducationArray" />
                      </tab-nav>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </template>
          </iq-card>
        </b-col>
        <b-col sm="12">
          <b-row>
            <b-col lg="3" class="profile-left">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Languages</h4>
                </template>
                <template v-slot:body>
                  <b-row v-for="(language, index) in user.languages" :key="index">
                    <b-col>
                      <div style="display: inline-flex; align-items:center;">
                        <h6 class="mr-1 ml-1">{{language.language}} - </h6>
                        <span class="text-size-12">{{language.fluency}}</span>
                      </div>
                    </b-col>
                  </b-row>
                </template>
              </iq-card>
            </b-col>
            <b-col lg="9" class="profile-center">
              <tab-content id="pills-tabContent-2">
                <tab-content-item :active="true" id="profile-skills" aria-labelled-by="pills-skills-tab">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4>Skills</h4>
                    </template>
                    <template v-slot:body>
                      <b-row class="skill-div" v-if="user.masterSkills.length > 0">
                        <div style="display: inline-flex;align-items: center;">
                          <span class="mr-1">
                            <svg width="24px" height="24px" viewBox="0 0 24 24">
                              <path d="M16 1.2C15 1.2 14.2 2 14.2 3S15 4.8 16 4.8 17.8 4 17.8 3 17 1.2 16 1.2M12.4 4.1C11.93 4.1 11.5 4.29 11.2 4.6L7.5 8.29C7.19 8.6 7 9 7 9.5C7 10.13 7.33 10.66 7.85 10.97L11.2 13V18H13V11.5L10.75 9.85L13.07 7.5L14.8 10H19V8.2H15.8L13.86 4.93C13.57 4.43 13 4.1 12.4 4.1M10 3H3C2.45 3 2 2.55 2 2S2.45 1 3 1H12.79C12.58 1.34 12.41 1.71 12.32 2.11C11.46 2.13 10.65 2.45 10 3M5 12C2.24 12 0 14.24 0 17S2.24 22 5 22 10 19.76 10 17 7.76 12 5 12M5 20.5C3.07 20.5 1.5 18.93 1.5 17S3.07 13.5 5 13.5 8.5 15.07 8.5 17 6.93 20.5 5 20.5M19 12C16.24 12 14 14.24 14 17S16.24 22 19 22 24 19.76 24 17 21.76 12 19 12M19 20.5C17.07 20.5 15.5 18.93 15.5 17S17.07 13.5 19 13.5 22.5 15.07 22.5 17 20.93 20.5 19 20.5M5.32 11H1C.448 11 0 10.55 0 10S.448 9 1 9H5.05C5.03 9.16 5 9.33 5 9.5C5 10.03 5.12 10.54 5.32 11M6 7H2C1.45 7 1 6.55 1 6S1.45 5 2 5H7.97L6.09 6.87C6.05 6.91 6 6.96 6 7Z"></path>
                            </svg>
                          </span>
                          <h5>Master<span class="font-size-12"> ({{user.masterSkills.length}}) </span></h5>
                          <label class="pointer" @click="masterCollapse = !masterCollapse">
                            <i v-if="!masterCollapse" class="ri-arrow-drop-down-line fa-xl"></i>
                            <i v-else class="ri-arrow-drop-up-line fa-xl"></i>
                          </label>
                        </div>
                        <b-collapse v-model="masterCollapse" class="skillCollapse">
                          <b-row>
                            <b-col>
                              <b-badge
                                pill
                                variant="secondary"
                                class="mr-1"
                                v-for="(skill, index) in user.masterSkills" :key="index"
                              >
                                <i @click="getSkillModal(skill)" class="pointer">{{skill.name}}</i>
                              </b-badge>
                            </b-col>
                          </b-row>
                        </b-collapse>
                      </b-row>
                      <b-row class="skill-div" v-if="user.expertSkills.length > 0">
                        <div style="display: inline-flex;align-items: center;">
                          <span class="mr-1">
                            <svg width="24px" height="24px" viewBox="0 0 24 24">
                              <path d="M16.5,5.5A2,2 0 0,0 18.5,3.5A2,2 0 0,0 16.5,1.5A2,2 0 0,0 14.5,3.5A2,2 0 0,0 16.5,5.5M12.9,19.4L13.9,15L16,17V23H18V15.5L15.9,13.5L16.5,10.5C17.89,12.09 19.89,13 22,13V11C20.24,11.03 18.6,10.11 17.7,8.6L16.7,7C16.34,6.4 15.7,6 15,6C14.7,6 14.5,6.1 14.2,6.1L9,8.3V13H11V9.6L12.8,8.9L11.2,17L6.3,16L5.9,18L12.9,19.4M4,9A1,1 0 0,1 3,8A1,1 0 0,1 4,7H7V9H4M5,5A1,1 0 0,1 4,4A1,1 0 0,1 5,3H10V5H5M3,13A1,1 0 0,1 2,12A1,1 0 0,1 3,11H7V13H3Z"></path>
                            </svg>
                          </span>
                          <h5>Expert<span class="font-size-12"> ({{user.expertSkills.length}}) </span></h5>
                          <label class="pointer" @click="expertCollapse = !expertCollapse">
                            <i v-if="!expertCollapse" class="ri-arrow-drop-down-line fa-xl"></i>
                            <i v-else class="ri-arrow-drop-up-line fa-xl"></i>
                          </label>
                        </div>
                        <b-collapse v-model="expertCollapse" class="skillCollapse">
                          <b-row>
                            <b-col>
                              <b-badge
                                pill
                                variant="secondary"
                                class="mr-1"
                                v-for="(skill, index) in user.expertSkills" :key="index"
                              >
                                <i @click="getSkillModal(skill)" class="pointer">{{skill.name}}</i>
                              </b-badge>
                            </b-col>
                          </b-row>
                        </b-collapse>
                      </b-row>
                      <b-row class="skill-div" v-if="user.proficentSkills.length > 0">
                        <div style="display: inline-flex;align-items: center;">
                          <span class="mr-1">
                            <svg width="24px" height="24px" viewBox="0 0 24 24">
                              <path d="M13.5,5.5C14.59,5.5 15.5,4.58 15.5,3.5C15.5,2.38 14.59,1.5 13.5,1.5C12.39,1.5 11.5,2.38 11.5,3.5C11.5,4.58 12.39,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z"></path>
                            </svg>
                          </span>
                          <h5>Proficent<span class="font-size-12"> ({{user.proficentSkills.length}}) </span></h5>
                          <label class="pointer" @click="proficentCollapse = !proficentCollapse">
                            <i v-if="!proficentCollapse" class="ri-arrow-drop-down-line fa-xl"></i>
                            <i v-else class="ri-arrow-drop-up-line fa-xl"></i>
                          </label>
                        </div>
                        <b-collapse v-model="proficentCollapse" class="skillCollapse">
                          <b-row>
                            <b-col>
                              <b-badge
                                pill
                                variant="secondary"
                                class="mr-1"
                                v-for="(skill, index) in user.proficentSkills" :key="index"
                              >
                                <i @click="getSkillModal(skill)" class="pointer">{{skill.name}}</i>
                              </b-badge>
                            </b-col>
                          </b-row>
                        </b-collapse>
                      </b-row>
                      <b-row class="skill-div" v-if="user.noviceSkills.length > 0">
                        <div style="display: inline-flex;align-items: center;">
                          <span class="mr-1">
                            <svg width="24px" height="24px" viewBox="0 0 24 24">
                              <path d="M14.12,10H19V8.2H15.38L13.38,4.87C13.08,4.37 12.54,4.03 11.92,4.03C11.74,4.03 11.58,4.06 11.42,4.11L6,5.8V11H7.8V7.33L9.91,6.67L6,22H7.8L10.67,13.89L13,17V22H14.8V15.59L12.31,11.05L13.04,8.18M14,3.8C15,3.8 15.8,3 15.8,2C15.8,1 15,0.2 14,0.2C13,0.2 12.2,1 12.2,2C12.2,3 13,3.8 14,3.8Z"></path>
                            </svg>
                          </span>
                          <h5>Novice<span class="font-size-12"> ({{user.noviceSkills.length}}) </span></h5>
                          <label class="pointer" @click="noviceCollapse = !noviceCollapse">
                            <i v-if="!noviceCollapse" class="ri-arrow-drop-down-line fa-xl"></i>
                            <i v-else class="ri-arrow-drop-up-line fa-xl"></i>
                          </label>
                        </div>
                        <b-collapse v-model="noviceCollapse" class="skillCollapse">
                          <b-row>
                            <b-col>
                              <b-badge
                                pill
                                variant="secondary"
                                class="mr-1"
                                v-for="(skill, index) in user.noviceSkills" :key="index"
                              >
                                <i @click="getSkillModal(skill)" class="pointer">{{skill.name}}</i>
                              </b-badge>
                            </b-col>
                          </b-row>
                        </b-collapse>
                      </b-row>
                      <b-row class="skill-div" v-if="user.nebiSkills.length > 0">
                        <div style="display: inline-flex;align-items: center;">
                          <span class="mr-1">
                            <svg width="24px" height="24px" viewBox="0 0 24 24">
                              <path d="M18.5,4A2.5,2.5 0 0,1 21,6.5A2.5,2.5 0 0,1 18.5,9A2.5,2.5 0 0,1 16,6.5A2.5,2.5 0 0,1 18.5,4M4.5,20A1.5,1.5 0 0,1 3,18.5A1.5,1.5 0 0,1 4.5,17H11.5A1.5,1.5 0 0,1 13,18.5A1.5,1.5 0 0,1 11.5,20H4.5M16.09,19L14.69,15H11L6.75,10.75C6.75,10.75 9,8.25 12.5,8.25C15.5,8.25 15.85,9.25 16.06,9.87L18.92,18C19.2,18.78 18.78,19.64 18,19.92C17.22,20.19 16.36,19.78 16.09,19Z"></path>
                            </svg>
                          </span>
                          <h6>Not experience but interested<span class="font-size-12"> ({{user.nebiSkills.length}}) </span></h6>
                          <label class="pointer" @click="nebiCollapse = !nebiCollapse">
                            <i v-if="!nebiCollapse" class="ri-arrow-drop-down-line fa-xl"></i>
                            <i v-else class="ri-arrow-drop-up-line fa-xl"></i>
                          </label>
                        </div>
                        <b-collapse v-model="nebiCollapse" class="skillCollapse">
                          <b-row>
                            <b-col>
                              <b-badge
                                pill
                                variant="secondary"
                                class="mr-1"
                                v-for="(skill, index) in user.nebiSkills" :key="index"
                              >
                                <i @click="getSkillModal(skill)" class="pointer">{{skill.name}}</i>
                              </b-badge>
                            </b-col>
                          </b-row>
                        </b-collapse>
                      </b-row>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="profile-about" aria-labelled-by="pills-about-tab">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">About</h4>
                    </template>
                    <template v-slot:body>
                      <div class="about-info m-0 p-0">
                        <b-row>
                          <b-col cols="12"><p>{{user.about}}</p></b-col>
                          <b-col cols="3">Location: </b-col>
                          <b-col cols="9">{{user.location}}</b-col>
                        </b-row>
                      </div>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="profile-related" aria-labelled-by="pills-related-tab">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Relevant People in Torre</h4>
                    </template>
                    <template v-slot:body>
                      <ul class="suggestions-lists m-0 p-0">
                        <li v-for="(item,index) in relatedPeople" :key="index" class="d-flex mb-4 align-items-center">
                          <div class="user-img img-fluid">
                            <b-img :src="item.image" alt="story-img" rounded="circle" class="avatar-40" />
                          </div>
                          <div class="media-support-info ml-3">
                            <h6>{{ item.name }}</h6>
                            <p class="mb-0">{{ item.role }}</p>
                          </div>
                          <div class="iq-card-header-toolbar d-flex align-items-center">
                            <b-dropdown id="dropdownMenuButton40" right variant="none" menu-class="p-0">
                              <template v-slot:button-content>
                                <i class="ri-more-2-line"></i>
                              </template>
                              <b-dropdown-item :href="`https://torre.co/${item.username}`"><i class="ri-user-unfollow-line mr-2"></i>Visit Profile</b-dropdown-item>
                            </b-dropdown>
                          </div>
                        </li>
                      </ul>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="profile-education" aria-labelled-by="pills-education-tab">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Education</h4>
                    </template>
                    <template v-slot:body>
                      <TimeLine :items="educationItems" />
                    </template>
                  </iq-card>
                </tab-content-item>
              </tab-content>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else>
      <div class="container-fluid p-0">
        <div class="row no-gutters">
          <div class="col-sm-12 text-center">
            <div class="iq-error">
              <img :src="image500" class="img-fluid iq-error-img" alt="500">
              <h2 class="mb-0">Oops! we couldn't find the user</h2>
              <p>Looks like the user "{{this.$route.params.username}}" doesn't match any Torre member. Please verify and try again</p>
              <a href="/" class="btn btn-primary mt-3"><i class="ri-home-4-line"></i>Back to Home</a>
            </div>
          </div>
        </div>
  </div>
    </b-container>
  </b-overlay>
</template>
<script>
import { core } from '../../config/pluginInit'
import axios from 'axios'
export default {
  name: 'SocialApp',
  mounted () {
    core.index()
    this.getTorreInfo()
    this.clearModal()
  },
  data () {
    return {
      userFound: false,
      overlay: true,
      skillModal: {
        status: false,
        skill: {
          name: '',
          proficiency: ''
        }
      },
      user: {
        background: require('../../assets/images/user/Banner-profile.jpg'),
        profile: require('../../assets/images/user/user-11.png'),
        name: '',
        role: '',
        about: '',
        email: '',
        phone: '',
        location: '',
        skills: [],
        masterSkills: [],
        expertSkills: [],
        proficentSkills: [],
        noviceSkills: [],
        nebiSkills: [],
        otherSkills: [],
        languages: [],
        careated_date: ''
      },
      masterCollapse: false,
      expertCollapse: false,
      proficentCollapse: false,
      noviceCollapse: false,
      nebiCollapse: false,
      otherCollapse: false,
      torreInfo: {},
      educationItems: [],
      relatedPeople: [
      ],
      image404: require('../../assets/images/error/error-01.png'),
      image500: require('../../assets/images/error/error-.png')
    }
  },
  methods: {
    clearModal () {
      this.skillModal = {
        status: false,
        skill: {
          name: '',
          proficiency: ''
        }
      }
      this.relatedPeople = []
    },
    async getTorreInfo () {
      var canProceed = false
      await axios.get(`https://bio.torre.co/api/bios/${this.$route.params.username}`, {
        headers: {}
      }).then(res => {
        this.torreInfo = res.data
        this.user.profile = this.torreInfo.person.pictureThumbnail
        this.user.name = this.torreInfo.person.name
        this.user.about = this.torreInfo.person.summaryOfBio
        this.user.location = this.torreInfo.person.location.shortName
        this.user.role = this.torreInfo.person.professionalHeadline
        this.user.skills = this.torreInfo.strengths
        this.user.languages = this.torreInfo.languages
        this.userFound = true
        canProceed = true
      }).catch((error) => {
        console.log('Error getting user information: ', error)
        this.overlay = false
      })
      if (canProceed) {
        this.overlay = false
        this.classifySkills()
        this.getEducationArray()
      }
    },
    classifySkills () {
      for (let index = 0; index < this.user.skills.length; index++) {
        var currSkillProficiency = this.user.skills[index].proficiency
        switch (currSkillProficiency) {
          case 'master':
            this.user.masterSkills.push(this.user.skills[index])
            break
          case 'expert':
            this.user.expertSkills.push(this.user.skills[index])
            break
          case 'proficent':
            this.user.proficentkills.push(this.user.skills[index])
            break
          case 'novice':
            this.user.noviceSkills.push(this.user.skills[index])
            break
          case 'no-experience-interested':
            this.user.nebiSkills.push(this.user.skills[index])
            break
          default:
            this.user.otherSkills.push(this.user.skills[index])
        }
      }
    },
    getEducationArray () {
      this.educationItems = []
      for (let index = 0; index < this.torreInfo.education.length; index++) {
        var currEducation = this.torreInfo.education[index]
        this.educationItems.push({
          color: 'success',
          title: currEducation.name,
          description: currEducation.organizations[0].name,
          right: `${currEducation.fromMonth}  ${currEducation.fromYear} - ${currEducation.toMonth} ${currEducation.toYear}`,
          child: {
            type: 'img',
            items: [
            ]
          }
        })
      }
    },
    async getSkillModal (skill) {
      this.relatedPeople = []
      this.skillModal.skill = await skill
      this.findPeopleBySkill(skill)
      this.skillModal.status = true
    },
    async findPeopleBySkill (skill) {
      this.relatedPeople = []
      var people = []
      await axios({
        method: 'post',
        url: 'https://search.torre.co/people/_search/?',
        data: {
          skills: {
            name: skill.name
          }
        }
      }).then((ans) => {
        people = ans.data.results
        for (let index = 0; index < people.length; index++) {
          this.relatedPeople.push({
            name: people[index].name,
            role: people[index].professionalHeadline,
            image: people[index].picture,
            username: people[index].username
          })
        }
      })
    }
  }
}
</script>
<style scoped>
  .skill-div {
    margin: 0px 10px 0px 10px;
  }
  .skillCollapse {
    padding-left: 10px;
  }
  .pointer {
    cursor: pointer;
  }
</style>
