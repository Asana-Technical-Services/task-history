import { Dispatch, SetStateAction } from "react";
import "../App.css";
import styled from "styled-components";

interface TimelineProps {
  selectedIndex: number;
  selectNewIndex: (dex: number) => void;
  stories: Array<any>;
}

const TimelineWrapper = styled.div`
  padding: 2rem 0rem;
  flex-grow: 1;
  text-align: left;
  background: #f6f8f9;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Tickmark = styled.div`
  text-align: left;
  height: 0;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const StoryUnit = styled.div`
  font-size: 14px;
  display: flex;
  padding: 4px;
`;

const StoryDate = styled.span`
  font-size: 12px;
  color: rgb(111, 119, 130);
`;

const StoryDesc = styled.div`
  flex-grow: 1;
  height: 100%;
  margin: auto;
  margin-left: 2rem;
  color: rgb(21, 27, 38);
`;

const StoryButton = styled.button`
  text-align: left;
  cursor: pointer;
  background: none;
  padding: 0px;
  width: 100%;
  border: none;
  background: none;
  border-top: 3px solid transparent;
  &: hover {
    border-top: 3px solid lightblue;
  } ;
`;

const SelectedStory = styled.div`
  border: none;
  background: none;
  text-align: left;
  border-top: 3px solid lightblue;
  padding: 0px;
  margin: 0px;
  width: 100%;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  background: none;
`;

const TimelineTitle = styled.h3`
  padding-left: 2rem;
`;

function Timeline(props: TimelineProps) {
  return (
    <TimelineWrapper>
      <TimelineTitle>Timeline</TimelineTitle>
      <ScrollContainer>
        <StoryUnit>
          <StoryDesc>
            <b>Today</b>
          </StoryDesc>
        </StoryUnit>
        {props.stories.map((story, dex) => {
          let storyDate = new Date(story?.created_at);
          return (
            <div>
              {dex === props.selectedIndex ? (
                <SelectedStory>
                  <StoryUnit>
                    <StoryDesc>
                      {story?.created_by?.name} {story?.text}
                      {". "}
                      <StoryDate>
                        {storyDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </StoryDate>
                    </StoryDesc>
                  </StoryUnit>
                </SelectedStory>
              ) : (
                <StoryButton
                  onClick={() => {
                    props.selectNewIndex(dex);
                  }}
                >
                  <StoryUnit>
                    <StoryDesc>
                      {story?.created_by?.name} {story?.text}
                      {". "}
                      <StoryDate>
                        {storyDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </StoryDate>
                    </StoryDesc>
                  </StoryUnit>
                </StoryButton>
              )}
            </div>
          );
        })}
      </ScrollContainer>
    </TimelineWrapper>
  );
}

export default Timeline;
