const ProjectModule = (function () {
  let instance;

  function constructInstance() {
    const WORK_DELAY = 50;
    const WORK_HOURS_PER_DAY = 8;

    return {
      participants: [],
      pricing: {},
      isBusy: false,

      /* implement initialization of the object */
      /* participants - predefined array of participants */
      /* pricing - predefined object (keyvalue collection) of pricing */
      init(participants, pricing) {

        if (participants) {
          this.participants = [];

          if (participants.length) {
            participants.forEach(participant => {
              if (typeof participant === 'object' && 'seniorityLevel' in participant) {
                this.participants.push(participant);
              }
            });
          }
        }

        if (pricing) {
          this.pricing = {};

          if (Object.keys(pricing).length > 0) {
            for (const level in pricing) {
              if (typeof pricing[level] === 'number' && pricing[level] >= 0) {
                this.pricing[level] = pricing[level];
              }
            }
          }
        }
      },

      /* pass found participant into callback, stops on first match */
      /* functor - function that will be executed for elements of participants array */
      /* callbackFunction - function that will be executed with found participant as argument or with null if not */
      /* callbackFunction (participant) => {} */
      findParticipant(functor, callbackFunction) {
        if (this.isBusy || typeof functor !== 'function') return false;

        this.isBusy = true;

        setTimeout(() => {
          let participant = this.participants.find(functor);

          if (!participant || participant.length === 0) participant = null;

          this.isBusy = false;
          if (callbackFunction && typeof callbackFunction === 'function') {
            callbackFunction(participant);
          }
        }, WORK_DELAY);
      },

      /* pass array of found participants into callback */
      /* functor - function that will be executed for elements of participants array */
      /* callbackFunction - function that will be executed with array of found participants as argument or empty array if not */
      /* callbackFunction (participantsArray) => {} */
      findParticipants(functor, callbackFunction) {
        if (this.isBusy || typeof functor !== 'function') return false;

        this.isBusy = true;

        setTimeout(() => {
          const participantsArray = this.participants.filter(functor);

          this.isBusy = false;
          if (callbackFunction && typeof callbackFunction === 'function') {
            callbackFunction(participantsArray);
          }
        }, WORK_DELAY);
      },

      /* push new participant into this.participants array */
      /* callbackFunction - function that will be executed when job will be done */
      /* (err) => {} */
      addParticipant(participantObject, callbackFunction) {
        if (this.isBusy) return false;

        this.isBusy = true;

        setTimeout(() => {
          let error;

          if (participantObject && typeof participantObject === 'object' && 'seniorityLevel' in participantObject) {
            this.participants.push(participantObject);
          } else {
            error =  new Error('Property "seniorityLevel" is not defined!');
          }

          this.isBusy = false;
          if (callbackFunction && typeof callbackFunction === 'function') {
            callbackFunction(error);
          }
        }, WORK_DELAY);
      },

      /* push new participant into this.participants array */
      /* callback should receive removed participant */
      /* callbackFunction - function that will be executed with object of removed participant or null if participant wasn't found when job will be done */
      removeParticipant(participantObject, callbackFunction) {
        if (this.isBusy) return false;

        this.isBusy = true;

        setTimeout(() => {
          let removedParticipant = null;
          const removeObjectIndex = this.participants.indexOf(participantObject);

          if(removeObjectIndex !== -1) {
            this.participants.splice(removeObjectIndex, 1);
            removedParticipant = participantObject;
          }

          this.isBusy = false;
          if(callbackFunction && typeof callbackFunction === 'function') {
            callbackFunction(removedParticipant);
          }

        }, WORK_DELAY);
      },

      /* Extends this.pricing with new field or change existing */
      /* callbackFunction - function that will be executed when job will be done, doesn't take any arguments */
      setPricing(participantPriceObject, callbackFunction) {
        if(this.isBusy) return false;

        this.isBusy = true;

        setTimeout(() => {
          if (participantPriceObject && Object.keys(participantPriceObject).length > 0) {
            for (const level in participantPriceObject) {
              if (typeof participantPriceObject[level] === 'number' && participantPriceObject[level] >= 0) {
                this.pricing[level] = participantPriceObject[level];
              }
            }
          }

          this.isBusy = false;
          if(callbackFunction && typeof callbackFunction === 'function') {
            callbackFunction();
          }
        }, WORK_DELAY);
      },

      /* calculates salary of all participants in the given period */
      /* periodInDays, has type number, one day is equal 8 working hours */
      calculateSalary(periodInDays) {
        let salary = 0;

        this.participants.forEach(participant => {
          if(!(participant.seniorityLevel in this.pricing)) {
            throw new Error('Passed seniorityLevel is not assigned in pricing list');
          } else {
            salary += this.pricing[participant.seniorityLevel] * periodInDays * WORK_HOURS_PER_DAY;
          }
        });

        return salary;
      }
    }
  }

  function getInstance() {
    if (!instance) {
      instance = constructInstance();
    }

    return instance;
  }

  return getInstance();
})();

module.exports = {
  firstName: 'Julia',
  lastName: 'Chudak',
  task: ProjectModule
};
