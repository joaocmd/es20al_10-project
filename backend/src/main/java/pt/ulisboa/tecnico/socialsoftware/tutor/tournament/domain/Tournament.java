package pt.ulisboa.tecnico.socialsoftware.tutor.tournament.domain;

import pt.ulisboa.tecnico.socialsoftware.tutor.config.DateHandler;
import pt.ulisboa.tecnico.socialsoftware.tutor.course.CourseExecution;
import pt.ulisboa.tecnico.socialsoftware.tutor.exceptions.TutorException;
import pt.ulisboa.tecnico.socialsoftware.tutor.question.domain.Topic;
import pt.ulisboa.tecnico.socialsoftware.tutor.quiz.domain.Quiz;
import pt.ulisboa.tecnico.socialsoftware.tutor.tournament.dto.TournamentDto;
import pt.ulisboa.tecnico.socialsoftware.tutor.user.User;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static pt.ulisboa.tecnico.socialsoftware.tutor.exceptions.ErrorMessage.*;

@Entity
@Table(name = "tournaments")
public class Tournament {
    public enum Status {OPEN,CANCELED,RUNNING,FINISHED}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToMany
    @Column(name = "topic_id")
    private Set<Topic> topics = new HashSet<>();

    private Integer numberOfQuestions;

    private LocalDateTime startingDate;

    private LocalDateTime conclusionDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToMany(cascade = CascadeType.ALL)
    @Column(name = "user_id")
    private Set<User> signedUpUsers = new HashSet<>();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "course_execution_id")
    private CourseExecution courseExecution;

    public Tournament() {}

    public Tournament(User creator, TournamentDto tournamentDto) {
        this(creator, tournamentDto.getTitle(),
                tournamentDto.getStartingDateDate(), tournamentDto.getConclusionDateDate(),
                tournamentDto.getNumberOfQuestions());
    }

    public Tournament(User creator, String title,
                      LocalDateTime startDate, LocalDateTime conclusionDate,
                      int nQuestions) {
        checkTitle(title);
        setCreator(creator);
        checkStartingDate(startDate);
        checkConclusionDate(conclusionDate);

        this.status = Status.OPEN;
        if (nQuestions < 1) {
            throw new TutorException(TOURNAMENT_NOT_CONSISTENT, " number of questions " + this.numberOfQuestions
                    + " must be greater than 1");
        }
        this.numberOfQuestions = nQuestions;

    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public User getCreator() {
        return creator;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void checkTitle(String title) {
        if (title == null || title.isEmpty() || title.isBlank()) {
            throw new TutorException(TOURNAMENT_NOT_CONSISTENT, " title " + title + " can't be blank");
        }
        setTitle(title);
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getId() { return id; }

    public Set<Topic> getTopics() { return topics; }

    public void addTopic(Topic topic) {
        Set<Topic> validTopics = courseExecution.getCourse().getTopics();

        if (!validTopics.contains(topic)) {
            throw new TutorException(TOURNAMENT_NOT_CONSISTENT, " topic" + topic
                    + " is invalid for this course execution");
        }
        topics.add(topic);
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public Integer getNumberOfQuestions() { return numberOfQuestions; }

    public LocalDateTime getStartingDate() { return startingDate; }

    public void setStartingDate(LocalDateTime startingDate) {
        this.startingDate = startingDate;
    }

    public LocalDateTime getConclusionDate() { return conclusionDate; }

    public void setConclusionDate(LocalDateTime conclusionDate) {
        this.conclusionDate = conclusionDate;
    }

    public Quiz getQuiz() { return quiz; }

    public CourseExecution getCourseExecution() {
        return courseExecution;
    }

    public void setCourseExecution(CourseExecution courseExecution) {
        this.courseExecution = courseExecution;
    }

    public void addSignUp(User user) {
        this.signedUpUsers.add(user);
    }

    public Set<User> getSignedUpUsers() {
        return signedUpUsers;
    }

    public void setSignedUpUsers(Set<User> signedUpUsers) {
        this.signedUpUsers = signedUpUsers;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setNumberOfQuestions(Integer numberOfQuestions) {
        this.numberOfQuestions = numberOfQuestions;
    }

    void checkStartingDate(LocalDateTime startingDate) {
        if (startingDate == null || startingDate.isBefore(DateHandler.now())) {
            throw new TutorException(TOURNAMENT_NOT_CONSISTENT, " starting date " + startingDate
                    + " must be set in the future");
        }
        if (this.conclusionDate != null && !conclusionDate.isAfter(startingDate)) {
            throw new TutorException(TOURNAMENT_NOT_CONSISTENT, " starting date " + startingDate
                    + " must be before conclusion date " + conclusionDate);
        }
        setStartingDate(startingDate);
    }

    void checkConclusionDate(LocalDateTime conclusionDate) {
        if (conclusionDate == null) {
            throw new TutorException(TOURNAMENT_NOT_CONSISTENT, " conclusion date " + conclusionDate);
        }
        if (this.startingDate != null && !conclusionDate.isAfter(startingDate)) {
            throw new TutorException(TOURNAMENT_NOT_CONSISTENT, " conclusion date " + conclusionDate
                    + " must be after starting date "  + startingDate);
        }
        setConclusionDate(conclusionDate);
    }

    public void checkReadyForSignUp() {
        updateStatus();
        if (this.status.equals(Status.FINISHED) || this.status.equals(Status.RUNNING)){
            throw new TutorException(TOURNAMENT_SIGN_UP_OVER, this.id);
        }
        else if (this.status.equals(Status.CANCELED)){
            throw new TutorException(TOURNAMENT_SIGN_UP_CANCELED, this.id);
        }
    }

    public void checkAbleToBeCanceled() {
        updateStatus();
        if (this.status.equals(Status.CANCELED)){
            throw new TutorException(TOURNAMENT_ALREADY_CANCELED, this.id);
        }
        else if (this.status.equals(Status.RUNNING)){
            throw new TutorException(TOURNAMENT_RUNNING, this.id);
        }
        else if (this.status.equals(Status.FINISHED)){
            throw new TutorException(TOURNAMENT_FINISHED, this.id);
        }
    }

    public void cancel() {
        checkAbleToBeCanceled();
        status = Status.CANCELED;
    }

    public void updateStatus() {
        if (status.equals(Status.CANCELED) || status.equals(Status.FINISHED)) {
            return;
        }

        LocalDateTime currentTime = DateHandler.now();
        if(currentTime.isBefore(startingDate)) {
            setStatus(Status.OPEN);
        } else if(!currentTime.isBefore(startingDate) && currentTime.isBefore(conclusionDate)) {
            if (signedUpUsers.size() >= 2) {
                setStatus(Status.RUNNING);
            } else {
                setStatus(Status.CANCELED);
            }
        } else {
            if (!signedUpUsers.isEmpty()) {
                setStatus(Status.FINISHED);
            } else {
                setStatus(Status.CANCELED);
            }
        }
    }

    public boolean needsQuiz() {
        return this.status == Status.RUNNING && this.quiz == null;
    }

    @Override
    public String toString() {
        return "Tournament{" +
                "id=" + id +
                ", title" + title +
                ", creator" + creator +
                ", startingDate=" + startingDate +
                ", conclusionDate=" + conclusionDate +
                ", status=" + status +
                ", numberOfQuestions=" + numberOfQuestions +
                ", topics=" + topics +
                '}';
    }
}
