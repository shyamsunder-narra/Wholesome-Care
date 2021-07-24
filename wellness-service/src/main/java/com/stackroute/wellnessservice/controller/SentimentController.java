package com.stackroute.wellnessservice.controller;

import java.util.ArrayList;

import com.stackroute.wellnessservice.exception.StringNotFoundException;
import com.stackroute.wellnessservice.service.SentimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@CrossOrigin
public class SentimentController {
   /* private SentimentService semanticService;
    @Autowired
    public SentimentController(SentimentService semanticService){
        this.semanticService = semanticService;
    }
    
    @RequestMapping(method=RequestMethod.POST,value="api/v1/wellnessResource")
    public ResponseEntity<?> getWellnessResources(@RequestBody String text){
        try {
            return new ResponseEntity<ArrayList<String>>(semanticService.getResource(text), HttpStatus.OK);
        } catch (StringNotFoundException e){
            return new ResponseEntity<String>("No String", HttpStatus.CONFLICT);
  } 

    }*/}

