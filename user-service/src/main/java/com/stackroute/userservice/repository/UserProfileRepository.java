package com.stackroute.userservice.repository;
import com.stackroute.userservice.model.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface UserProfileRepository extends MongoRepository<UserProfile,String> {
    Optional<UserProfile> findByEmail(String email);
}
