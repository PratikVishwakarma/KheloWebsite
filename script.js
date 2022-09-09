/*********************************
*********QUIZ CONTROLLER*********
*********************************/
var quizController = (function () {

    /*  Question Constructor */
    function Question(id, question, category, answer, correctAnswer) {
        this.id = id
        this.question = question
        this.category = category
        this.answer = answer
        this.correctAnswer = correctAnswer
    }

    var questionLocalStorage = {
        setQuestionCollection: (newCollection) => {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection))
        },
        getQuestionCollection: () => {
            return JSON.parse(localStorage.getItem('questionCollection'))
        },
        removeQuestionCollection: () => {
            // localStorage.removeItem('questionCollection')
            localStorage.setItem('questionCollection', '[]')
        }
    }

    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([])
    }

    var quizProgress = {
        questionIndex: 0
    }


    /*  Person Constructor */
    function Person(id, firstName, lastName, score) {
        this.id = id
        this.firstName = firstName
        this.lastName = lastName
        this.score = score
    }

    var personLocalStorage = {
        setPersonData: (newPersonData) => {
            localStorage.setItem('personData', JSON.stringify(newPersonData))
        },
        getPersonData: () => {
            return JSON.parse(localStorage.getItem('personData'))
        },
        removePersonData: () => {
            localStorage.removeItem('personData')
            // localStorage.setItem('personData', '[]')
        }
    }

    var currentPersonData = {
        fullname: [],
        score: 0
    }

    var adminFullName = ['a', 'a']

    if (personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([])
    }

    return {
        getQuizProgress: quizProgress,
        addQuestionOnLocalStorage: (newQuestionText, newCategoryText, opts) => {
            var optionsArr, corrAns, newQuestion, questionId;

            optionsArr = []
            if (newQuestionText.value !== "") {
                for (var i = 0; i < opts.length; i++) {
                    if (opts[i].value !== "") {
                        optionsArr.push(opts[i].value)
                    }
                    if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
                        corrAns = opts[i].value
                    }
                }
                var questionCollection = questionLocalStorage.getQuestionCollection()
                if (questionCollection.length > 0) {
                    questionId = questionCollection[questionCollection.length - 1].id + 1
                } else {
                    questionId = 0
                }


                if (optionsArr.length > 1) {
                    if (corrAns === undefined) {
                        alert('Please, select the correct answer')
                        return false
                    }
                    else {
                        newQuestion = new Question(questionId, newQuestionText.value, newCategoryText.value, optionsArr, corrAns)
                        questionCollection.push(newQuestion)
                        questionLocalStorage.setQuestionCollection(questionCollection)
                        newQuestionText.value = ""

                        for (var x = 0; x < opts.length; x++) {
                            opts[x].value = ""
                            opts[x].previousElementSibling.checked = false
                        }
                        return true
                    }
                } else {
                    alert('Please, insert atleast two answer')
                    return false
                }
            } else {
                alert('Please, insert question')
                return false
            }
        },
        questionLocalStorage,
        checkCorrectAnswer: (answer) => {
            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === answer.textContent) {
                currentPersonData.score++
                return true
            } else return false
        },
        isFinished: () => {
            return questionLocalStorage.getQuestionCollection().length === quizProgress.questionIndex + 1
        },
        addPerson: () => {
            var newPerson, personId, personData
            var personCollection = personLocalStorage.getPersonData()
            if (personCollection.length > 0) {
                personId = personCollection[personCollection.length - 1].id + 1
            } else {
                personId = 0
            }

            newPerson = new Person(personId, currentPersonData.fullname[0], currentPersonData.fullname[1], currentPersonData.score)

            personData = personLocalStorage.getPersonData()
            personData.push(newPerson)
            personLocalStorage.setPersonData(personData)
            console.log(newPerson)
        },
        getCurrentPersonData: currentPersonData,
        getAdminFullName: adminFullName,
        personLocalStorage
    }
}())
/*********************************
***********UI CONTROLLER*********
*********************************/

var UIController = (function () {
    var domItems = {
        // Admin Panel Elements
        adminPanelContainer: document.querySelector(".admin-panel-container"),
        questionInsertButton: document.getElementById('question-insert-btn'),
        newQuestionText: document.getElementById('new-question-text'),
        newCategoryText: document.getElementById('new-category-text'),
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestinoWrapper: document.querySelector(".inserted-questions-wrapper"),
        questionUpdateBtn: document.getElementById('question-update-btn'),
        questionDeleteBtn: document.getElementById('question-delete-btn'),
        questionsClearBtn: document.getElementById('questions-clear-btn'),
        questionsExportBtn: document.getElementById('questions-export-btn'),
        resultsListWrapper: document.querySelector('.results-list-wrapper'),
        resultsClearBtn: document.getElementById('results-clear-btn'),

        //***************QUIZ SECTION ELEMENTS***************/
        quizContainer: document.querySelector('.quiz-container'),
        progress: document.getElementById('progress'),
        progressBar: document.querySelector(".progressBar"),
        askedQuestionText: document.getElementById('asked-question-text'),
        quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
        instantAnswerContainer: document.querySelector('.instant-answer-container'),
        instantAnswerText: document.getElementById('instant-answer-text'),
        nextQuestionBtn: document.getElementById('next-question-btn'),
        emotion: document.getElementById('emotion'),
        instantAnswerWrapper: document.getElementById('instant-answer-wrapper'),
        finalScoreText: document.getElementById('final-score-text'),
        finalResultContainer: document.querySelector('.final-result-container'),
        //****************LANDING PAGE ELEMENTS**********************/
        startQuizBtn: document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),
        landingPageContainer: document.querySelector(".landing-page-container"),
    }

    return {
        getDomItems: domItems,

        addInputsDynamically: () => {
            var addInput = () => {
                var inputHTML, z
                z = document.querySelectorAll('.admin-option').length
                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"> <input type="text" class="admin-option admin-option-' + z + '" value=""></div>'
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML)
                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            }
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },

        createQuestionList: (questionCollection) => {
            domItems.insertedQuestinoWrapper.innerHTML = "";
            var inputHTML
            if (questionCollection !== null) {
                questionCollection.forEach((element, index) => {
                    inputHTML += '<p><span>' + (index + 1) + '.  ' + (element.question) + '</span><button id="question-' + element.id + '">Edit</button></p>'
                });
                domItems.insertedQuestinoWrapper.insertAdjacentHTML('afterbegin', inputHTML)
            }
        },

        editQuestion: (event, storageQuestionList, addInputsDynamicallyFun, createQuestionListFun) => {
            var getId, foundItem, foundIndex, optionHtml

            if ('question-'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('-')[1])
                var questionCollection = storageQuestionList.getQuestionCollection()
                questionCollection.forEach((data, index) => {
                    if (data.id == getId) {
                        foundItem = data
                        foundIndex = index
                    }
                })

                optionHtml = ''
                domItems.newQuestionText.value = foundItem.question
                domItems.newCategoryText.value = foundItem.category
                domItems.adminOptionsContainer.innerHTML = ""
                foundItem.answer.forEach((option, index) => {
                    optionHtml += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + index + '" name="answer" value="' + index + '"><input type="text" class="admin-option admin-option-' + index + '" value="' + option + '"></div>'
                })
                domItems.adminOptionsContainer.innerHTML = optionHtml
                addInputsDynamicallyFun()
                domItems.questionUpdateBtn.style.visibility = 'visible'
                domItems.questionDeleteBtn.style.visibility = 'visible'
                domItems.questionInsertButton.style.visibility = 'hidden'
                domItems.questionsClearBtn.style.pointerEvents = 'none'


                var backToDefaultView = () => {
                    domItems.questionUpdateBtn.style.visibility = 'hidden'
                    domItems.questionDeleteBtn.style.visibility = 'hidden'
                    domItems.questionInsertButton.style.visibility = 'visible'
                    domItems.questionsClearBtn.style.pointerEvents = ''


                    domItems.newQuestionText.value = ""
                    domItems.adminOptionsContainer.innerHTML = `  <div class="admin-option-wrapper">
                    <input type="radio" class="admin-option-0" name="answer" value="0">
                    <input type="text" class="admin-option admin-option-0" value="">
                </div>
                <div class="admin-option-wrapper">
                    <input type="radio" class="admin-option-1" name="answer" value="1">
                    <input type="text" class="admin-option admin-option-1" value="">
                </div>`
                    addInputsDynamicallyFun()
                }

                domItems.questionUpdateBtn.onclick = () => {
                    var newOptions, optionElements;
                    newOptions = []

                    optionElements = document.querySelectorAll('.admin-option')
                    foundItem.question = domItems.newQuestionText.value
                    foundItem.category = domItems.newCategoryText.value
                    foundItem.correctAnswer = ''

                    if (foundItem.question !== "") {
                        for (var i = 0; i < optionElements.length; i++) {
                            if (optionElements[i].value !== "") {
                                newOptions.push(optionElements[i].value)
                                if (optionElements[i].previousElementSibling.checked) {
                                    foundItem.correctAnswer = optionElements[i].value
                                }
                            }
                        }
                        foundItem.options = newOptions
                        if (newOptions.length > 1) {
                            if (foundItem.correctAnswer === "") alert('Please, select the correct answer')
                            else {
                                questionCollection.splice(foundIndex, 1, foundItem)
                                storageQuestionList.setQuestionCollection(questionCollection)

                                backToDefaultView()
                                createQuestionListFun(storageQuestionList.getQuestionCollection())
                            }
                        } else alert('Please, Insert atleast two answer')
                    } else alert('Please, Insert Question')
                }

                domItems.questionDeleteBtn.onclick = () => {
                    questionCollection.splice(foundIndex, 1)
                    storageQuestionList.setQuestionCollection(questionCollection)

                    backToDefaultView()
                    createQuestionListFun(storageQuestionList.getQuestionCollection())
                }
            }
        },
        clearQuestionList: (questionLocalStorage) => {
            if (questionLocalStorage.getQuestionCollection().length > 0) {
                var conf = confirm("Warning! You will lose entire question list")
                if (conf) {
                    questionLocalStorage.removeQuestionCollection()
                    domItems.insertedQuestinoWrapper.innerHTML = ''
                }
            }
        },
        exportQuestionList: (questionLocalStorage) => {
            if (questionLocalStorage.getQuestionCollection().length > 0) {
               
                const data = JSON.stringify(questionLocalStorage.getQuestionCollection())

                fileSystem.writeFile("./newClient.json", data, err=>{
                    if(err){
                        console.log("Error writing file" ,err)
                    } else {
                        console.log('JSON data is written to the file successfully')
                    }
                })
            }
        },
        displayQuestion: (questionLocalStorage, progress) => {
            if (questionLocalStorage.getQuestionCollection().length > 0) {
                var question, optionHtml, charArray
                charArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
                question = questionLocalStorage.getQuestionCollection()[progress.questionIndex]
                domItems.askedQuestionText.innerHTML = question.question
                domItems.quizOptionsWrapper.innerHTML = ''
                optionHtml = ''
                question.answer.forEach((option, index) => {
                    optionHtml += ' <div class="choice-' + index + '"><span class="choice-' + index + '">' + charArray[index] + '</span><p class="choice-' + index + '">' + option + '</p></div>'
                })
                domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', optionHtml)
            }
        },
        setProgressBar: (questionLocalStorage, progress) => {
            domItems.progress.textContent = (progress.questionIndex + 1) + "/" + questionLocalStorage.getQuestionCollection().length
            domItems.progressBar.lastElementChild.value = progress.questionIndex + 1
            domItems.progressBar.lastElementChild.max = questionLocalStorage.getQuestionCollection().length
        },
        newDesign: (result, selectedAnswer) => {
            var index, twoOptions
            index = 0

            twoOptions = {
                answerText: ["This is a wrong answer", "This is a correct answer"],
                answerClass: ['red', 'green'],
                answerImage: ["images/sad.png", "images/happy.png"],
                answerOptionSpanBG: ['rgba(200,0,0,.7)', 'rgba(0,250,0,.2)']
            }

            if (result) index = 1

            domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none"
            domItems.instantAnswerContainer.style.opacity = 1
            domItems.instantAnswerText.textContent = twoOptions.answerText[index]
            domItems.emotion.setAttribute('src', twoOptions.answerImage[index])
            domItems.instantAnswerWrapper.className = twoOptions.answerClass[index]
            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.answerOptionSpanBG[index]
        },
        resetDesign: () => {
            domItems.quizOptionsWrapper.style.cssText = ""
            domItems.instantAnswerContainer.style.opacity = 0
        },
        getFullName: (currentPerson, questionLocalStorage, admin) => {
            var firstName, lastName
            firstName = domItems.firstNameInput.value
            lastName = domItems.lastNameInput.value


            var resetPanels = (panelToShow) => {
                domItems.landingPageContainer.style.display = 'none'
                domItems.adminPanelContainer.style.display = 'none'
                domItems.quizContainer.style.display = 'none'

                panelToShow.style.display = 'block'
            }


            if (firstName !== "" && lastName !== "") {
                if (admin[0] === firstName && admin[1] === lastName)
                    resetPanels(domItems.adminPanelContainer)
                else {
                    if (questionLocalStorage.getQuestionCollection().length !== 0) {
                        currentPerson.fullname.push(firstName)
                        currentPerson.fullname.push(lastName)
                        resetPanels(domItems.quizContainer)
                    } else {
                        alert("Quiz is not ready, please contact to administrator")
                    }
                }
            } else alert("Please enter first and last name")

        },
        finelResult: (currentUser) => {
            domItems.finalResultContainer.style.display = 'block'
            domItems.quizContainer.style.display = 'none'
            domItems.finalScoreText.textContent = currentUser.fullname[0] + ' ' + currentUser.fullname[1] + ', your final score is ' + currentUser.score
        },
        addResultToPanel: (personDataStorage) => {
            var resultHtml;
            resultHtml = ''
            domItems.resultsListWrapper.innerHTML = ''
            personDataStorage.getPersonData().forEach((person, index) => {
                resultHtml += '<p class="person person-' + index + '"><span class="person-' + index + '">' + person.firstName + ' ' + person.lastName + ' - ' + person.score + ' Points</span><button id="delete-result-btn_' + person.id + '" class="delete-result-btn">Delete</button></p>'
            })
            domItems.resultsListWrapper.innerHTML = resultHtml
        },
        clearResultList: (personLocalStorage) => {
            if (personLocalStorage.getPersonData().length > 0) {
                var conf = confirm("Warning! You will lose entire result list")
                if (conf) {
                    personLocalStorage.removePersonData()
                    domItems.resultsListWrapper.innerHTML = ''
                }
            }
        },
        removeSingleResultFromList: (event, personLocalStorage, addResultToPanelFun) => {
            var getId, foundIndex
            if ('delete-result-btn_'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('_')[1])
                var personCollection = personLocalStorage.getPersonData()
                personCollection.forEach((data, index) => {
                    if (data.id == getId) {
                        foundIndex = index
                    }
                })
                personCollection.splice(foundIndex, 1)
                personLocalStorage.setPersonData(personCollection)
            }
            addResultToPanelFun(personLocalStorage)
        }
    }
}())

/*********************************
************CONTROLLER***********
*********************************/
var controller = (function (quizCtrl, UICtrl) {

    var selectedDOMItems = UICtrl.getDomItems

    UICtrl.addInputsDynamically()
    UICtrl.displayQuestion(quizCtrl.questionLocalStorage, quizCtrl.getQuizProgress)
    UICtrl.setProgressBar(quizCtrl.questionLocalStorage, quizCtrl.getQuizProgress)
    UICtrl.createQuestionList(quizCtrl.questionLocalStorage.getQuestionCollection())
    UICtrl.addResultToPanel(quizCtrl.personLocalStorage)

    selectedDOMItems.questionInsertButton.addEventListener('click', () => {
        if (quizCtrl.addQuestionOnLocalStorage(selectedDOMItems.newQuestionText, selectedDOMItems.newCategoryText, document.querySelectorAll('.admin-option'))) {
            UICtrl.createQuestionList(quizCtrl.questionLocalStorage.getQuestionCollection())
        }
    })

    selectedDOMItems.insertedQuestinoWrapper.addEventListener('click', (event) => {
        UICtrl.editQuestion(event, quizCtrl.questionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList)
    })

    selectedDOMItems.questionsClearBtn.onclick = () => {
        UICtrl.clearQuestionList(quizCtrl.questionLocalStorage)
    }

    selectedDOMItems.questionsExportBtn.onclick = () => {
        UICtrl.exportQuestionList(quizCtrl.questionLocalStorage)
    }

    selectedDOMItems.quizOptionsWrapper.addEventListener('click', (event) => {
        var updatedOptionsDiv = selectedDOMItems.quizOptionsWrapper.querySelectorAll('div')
        updatedOptionsDiv.forEach((option, index) => {
            if (event.target.className === 'choice-' + index) {
                var answer = document.querySelector('.quiz-options-wrapper div p.' + event.target.className)
                var checkCorrectAnswer = quizCtrl.checkCorrectAnswer(answer)
                UICtrl.newDesign(checkCorrectAnswer, answer)
                if (quizCtrl.isFinished())
                    selectedDOMItems.nextQuestionBtn.textContent = "Finish"
                var nextQuestion = () => {
                    if (quizCtrl.isFinished()) {
                        UICtrl.finelResult(quizCtrl.getCurrentPersonData)
                        quizCtrl.addPerson()
                    } else {
                        UICtrl.resetDesign()
                        quizCtrl.getQuizProgress.questionIndex++
                        UICtrl.displayQuestion(quizCtrl.questionLocalStorage, quizCtrl.getQuizProgress)
                        UICtrl.setProgressBar(quizCtrl.questionLocalStorage, quizCtrl.getQuizProgress)
                    }
                }

                selectedDOMItems.nextQuestionBtn.onclick = () => {
                    nextQuestion()
                }
            }
        })
    })

    selectedDOMItems.startQuizBtn.onclick = () => {
        UICtrl.getFullName(quizCtrl.getCurrentPersonData, quizCtrl.questionLocalStorage, quizCtrl.getAdminFullName)
    }

    selectedDOMItems.lastNameInput.addEventListener('keypress', (e) => {
        if (e.keyCode == 13)
            UICtrl.getFullName(quizCtrl.getCurrentPersonData, quizCtrl.questionLocalStorage, quizCtrl.getAdminFullName)
    })

    selectedDOMItems.resultsClearBtn.onclick = () => {
        UICtrl.clearResultList(quizCtrl.personLocalStorage)
    }

    selectedDOMItems.resultsListWrapper.addEventListener('click', (event) => {
        UICtrl.removeSingleResultFromList(event, quizCtrl.personLocalStorage, UICtrl.addResultToPanel)
        // quizCtrl.personLocalStorage.getPersonData().forEach((person) => {
        //     var target = document.getElementById('delete-result-btn_' + person.id)
        //     target.onclick = (event) => {
        //         UICtrl.removeSingleResultFromList(event, quizCtrl.personLocalStorage, UICtrl.addResultToPanel)
        //     }
        // })
    })

}(quizController, UIController)) 